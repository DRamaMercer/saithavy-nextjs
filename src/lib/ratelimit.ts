import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Validate required environment variables
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (process.env.NODE_ENV === "production") {
  if (!REDIS_URL) {
    throw new Error("UPSTASH_REDIS_REST_URL is required in production");
  }
  if (!REDIS_TOKEN) {
    throw new Error("UPSTASH_REDIS_REST_TOKEN is required in production");
  }
}

// Create rate limiter: 5 requests per hour per IP
// Only create Redis client if credentials are available
const redis =
  REDIS_URL && REDIS_TOKEN
    ? new Redis({
        url: REDIS_URL,
        token: REDIS_TOKEN,
      })
    : null;

// Export rate limiter (will be null in dev without env vars)
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "saithavy:contact",
    })
  : null;

// Helper function to check if rate limiting is enabled
export function isRateLimitingEnabled(): boolean {
  return ratelimit !== null;
}
