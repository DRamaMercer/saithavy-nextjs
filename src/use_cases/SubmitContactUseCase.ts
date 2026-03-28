import { Contact } from "../domain/entities/Contact";
import { IContactRepository } from "../domain/interfaces/IContactRepository";
import { IRateLimiter } from "../domain/interfaces/IRateLimiter";
import { contactSchema } from "../lib/validators";

export interface SubmitContactRequest {
  ip: string;
  body: unknown;
}

export interface SubmitContactResponse {
  success: boolean;
  error?: string;
  validationIssues?: Record<string, string[]>;
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    reset: number;
    retryAfter?: number;
  };
  statusCode: number;
}

export class SubmitContactUseCase {
  constructor(
    private rateLimiter: IRateLimiter,
    private contactRepository: IContactRepository,
  ) {}

  async execute(request: SubmitContactRequest): Promise<SubmitContactResponse> {
    // 1. Rate Limit Check
    const rateLimit = await this.rateLimiter.checkLimit(request.ip);

    if (!rateLimit.success) {
      return {
        success: false,
        error: "Too many submissions. Please try again later.",
        rateLimitInfo: {
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          reset: rateLimit.reset,
          retryAfter: Math.ceil((rateLimit.reset - Date.now()) / 1000),
        },
        statusCode: 429,
      };
    }

    // 2. Validation
    const result = contactSchema.safeParse(request.body);

    if (!result.success) {
      return {
        success: false,
        error: "Validation failed",
        validationIssues: result.error.flatten().fieldErrors,
        rateLimitInfo: {
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          reset: rateLimit.reset,
        },
        statusCode: 400,
      };
    }

    // 3. Spam Check
    if (result.data.honeypot && result.data.honeypot.length > 0) {
      // Silently reject spam - return success to not tip off bots
      return {
        success: true,
        rateLimitInfo: {
          limit: rateLimit.limit,
          remaining: rateLimit.remaining,
          reset: rateLimit.reset,
        },
        statusCode: 200,
      };
    }

    // 4. Create Entity & Save
    const contact: Contact = {
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      email: result.data.email,
      interest: result.data.interest as
        | "ai-consulting"
        | "remote-work"
        | "content-resources"
        | "speaking"
        | "other",
      message: result.data.message,
      timestamp: new Date(),
    };

    await this.contactRepository.save(contact);

    return {
      success: true,
      rateLimitInfo: {
        limit: rateLimit.limit,
        remaining: rateLimit.remaining,
        reset: rateLimit.reset,
      },
      statusCode: 200,
    };
  }
}
