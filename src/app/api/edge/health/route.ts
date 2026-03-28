/**
 * Edge Function: Health check
 *
 * Runtime: Edge (Vercel Edge Network)
 * Purpose: Health check endpoint for monitoring
 * Cache: No cache
 */

import { NextRequest, NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/health/database";
import { checkRedisHealth } from "@/lib/health/redis";
import { checkCacheHealth } from "@/lib/health/cache";
import type { HealthResponse, HealthCheckResult, HealthStatus } from "@/lib/health/types";

export const runtime = "edge";

/**
 * GET handler - Returns health status with real service checks
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Run all health checks in parallel for speed
    const [edgeResult, cacheResult, databaseResult, redisResult] =
      await Promise.allSettled([
        // Edge runtime check (always passes if code is running)
        Promise.resolve({
          status: "pass" as HealthStatus,
          latency: 0,
          timestamp: new Date().toISOString(),
        }),
        checkCacheHealth(),
        checkDatabaseHealth(),
        checkRedisHealth(),
      ]);

    // Extract results (handle rejected promises)
    const edge: HealthCheckResult =
      edgeResult.status === "fulfilled"
        ? edgeResult.value
        : {
            status: "fail" as HealthStatus,
            error: "Edge runtime error",
            timestamp: new Date().toISOString(),
          };
    const cache: HealthCheckResult =
      cacheResult.status === "fulfilled"
        ? cacheResult.value
        : {
            status: "fail" as HealthStatus,
            error: "Cache check failed",
            timestamp: new Date().toISOString(),
          };
    const database: HealthCheckResult =
      databaseResult.status === "fulfilled"
        ? databaseResult.value
        : {
            status: "fail" as HealthStatus,
            error: "Database check failed",
            timestamp: new Date().toISOString(),
          };
    const redis: HealthCheckResult =
      redisResult.status === "fulfilled"
        ? redisResult.value
        : {
            status: "fail" as HealthStatus,
            error: "Redis check failed",
            timestamp: new Date().toISOString(),
          };

    // Determine overall health status
    const allChecks = [edge, cache, database, redis];
    const failedChecks = allChecks.filter((check) => check.status === "fail");
    const degradedChecks = allChecks.filter(
      (check) => check.status === "degraded",
    );

    let status: "healthy" | "degraded" | "unhealthy";
    if (failedChecks.length > 0) {
      status = "unhealthy";
    } else if (degradedChecks.length > 0) {
      status = "degraded";
    } else {
      status = "healthy";
    }

    const responseTime = Date.now() - startTime;

    const healthResponse: HealthResponse = {
      status,
      checks: {
        edge,
        cache,
        database,
        redis,
      },
      metadata: {
        region: request.headers.get("x-vercel-ip-region") || "unknown",
        country: request.headers.get("x-vercel-ip-country") || "unknown",
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    };

    // Determine HTTP status code based on health
    const httpStatus =
      status === "healthy" ? 200 : status === "degraded" ? 200 : 503;

    return NextResponse.json(healthResponse, {
      status: httpStatus,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Response-Time": `${responseTime}ms`,
      },
    });
  } catch (_error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      },
    );
  }
}
