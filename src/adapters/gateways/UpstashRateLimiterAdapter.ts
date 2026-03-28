import {
  IRateLimiter,
  RateLimitResult,
} from "../../domain/interfaces/IRateLimiter";
import { ratelimit, isRateLimitingEnabled } from "../../lib/ratelimit";

export class UpstashRateLimiterAdapter implements IRateLimiter {
  async checkLimit(identifier: string): Promise<RateLimitResult> {
    // If rate limiting is disabled (no env vars), allow all requests
    if (!isRateLimitingEnabled() || !ratelimit) {
      return {
        success: true,
        limit: 9007199254740991,
        remaining: 9007199254740991,
        reset: Date.now() + 3600000,
        retryAfter: Date.now() + 3600000,
      };
    }

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
