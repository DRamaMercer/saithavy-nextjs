/**
 * Health Check Types
 *
 * Type definitions for health check system
 */

export type HealthStatus = "pass" | "fail" | "degraded";

export interface HealthCheckResult {
  status: HealthStatus;
  latency?: number;
  error?: string;
  timestamp: string;
}

export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  checks: {
    edge: HealthCheckResult;
    cache: HealthCheckResult;
    database: HealthCheckResult;
    redis: HealthCheckResult;
  };
  metadata: {
    region: string;
    country: string;
    responseTime: string;
    timestamp: string;
    version: string;
  };
}
