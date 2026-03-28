import { IRateLimiter, RateLimitResult } from "../../domain/interfaces/IRateLimiter";
import { ratelimit } from "../../lib/ratelimit";

export class UpstashRateLimiterAdapter implements IRateLimiter {
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.reset,
    };
  }
}
