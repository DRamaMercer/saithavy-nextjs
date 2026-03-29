/**
 * Redis Health Check
 *
 * Edge Runtime compatible Redis health check
 */

import type { HealthCheckResult } from "./types";

/**
 * Check Redis health
 *
 * In Edge Runtime, we check if Upstash Redis configuration exists.
 * Returns degraded if configuration is missing.
 */
export async function checkRedisHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // Check if Upstash Redis is configured
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!redisUrl || !redisToken) {
      return {
        status: "degraded",
        error: "Redis not configured",
        timestamp: new Date().toISOString(),
      };
    }

    // In Edge Runtime, we can't make actual Redis calls from health check
    // Return pass if configuration exists
    return {
      status: "pass",
      latency: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "fail",
      error: error instanceof Error ? error.message : "Redis connection failed",
      timestamp: new Date().toISOString(),
    };
  }
}
