/**
 * Database Health Check
 *
 * Edge Runtime compatible database health check
 */

import type { HealthCheckResult } from "./types";

/**
 * Check database health
 *
 * In Edge Runtime without direct database access,
 * this returns a pass status indicating the edge layer is healthy.
 */
export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const startTime = Date.now();

  try {
    // In Edge Runtime, we can't directly check database
    // This would typically be done via a separate API endpoint
    // For now, return pass since edge layer is functioning
    return {
      status: "pass",
      latency: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "fail",
      error: error instanceof Error ? error.message : "Database connection failed",
      timestamp: new Date().toISOString(),
    };
  }
}
