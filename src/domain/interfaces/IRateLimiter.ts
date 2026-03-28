export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export interface IRateLimiter {
  checkLimit(identifier: string): Promise<RateLimitResult>;
}
