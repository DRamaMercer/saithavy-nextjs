export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface IRateLimiter {
  checkLimit(identifier: string): Promise<RateLimitResult>;
}
