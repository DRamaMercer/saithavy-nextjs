import { NextRequest, NextResponse } from "next/server";
import { SubmitContactUseCase } from "@/use_cases/SubmitContactUseCase";
import { UpstashRateLimiterAdapter } from "@/adapters/gateways/UpstashRateLimiterAdapter";
import { LoggerContactRepository } from "@/adapters/repositories/LoggerContactRepository";

// Initialize adapters and use case
// In a full DI setup, this would be injected or retrieved from a container.
const rateLimiter = new UpstashRateLimiterAdapter();
const contactRepository = new LoggerContactRepository();
const submitContactUseCase = new SubmitContactUseCase(rateLimiter, contactRepository);

export async function POST(request: NextRequest) {
  try {
    // Extract infrastructure concerns (IP, Body)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous";

    const body = await request.json();

    // Execute application business rules
    const response = await submitContactUseCase.execute({ ip, body });

    // Map Use Case response to HTTP Response (Interface Adapter logic)
    const headers: Record<string, string> = {};
    if (response.rateLimitInfo) {
      headers["X-RateLimit-Limit"] = response.rateLimitInfo.limit.toString();
      headers["X-RateLimit-Remaining"] = response.rateLimitInfo.remaining.toString();
      if (response.rateLimitInfo.reset) {
        headers["X-RateLimit-Reset"] = response.rateLimitInfo.reset.toString();
      }
    }

    if (!response.success) {
      if (response.statusCode === 429) {
        return NextResponse.json(
          {
            error: response.error,
            retryAfter: response.rateLimitInfo?.retryAfter,
          },
          { status: 429, headers }
        );
      }

      if (response.statusCode === 400) {
        return NextResponse.json(
          {
            error: response.error,
            issues: response.validationIssues,
          },
          { status: 400, headers }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been received.",
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Contact API Controller error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
