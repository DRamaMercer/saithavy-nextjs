/**
 * Edge Function: Health check
 *
 * Runtime: Edge (Vercel Edge Network)
 * Purpose: Health check endpoint for monitoring
 * Cache: No cache
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * GET handler - Returns health status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    // Health check status
    // TODO: Implement actual health checks when services are ready:
    // - cache: await checkCacheHealth()
    // - database: await checkDatabaseConnection()
    // - redis: await checkUpstashConnection()
    const checks = {
      edge: true,
      cache: true, // Deterministic: assume healthy until implemented
      database: 'not_implemented',
      redis: 'not_implemented',
    };

    const isHealthy = Object.values(checks).every(
      (check) => check === true || check === 'not_implemented'
    );

    const responseTime = Date.now() - startTime;

    return NextResponse.json(
      {
        status: isHealthy ? 'healthy' : 'degraded',
        checks,
        metadata: {
          region: request.geo?.region || 'unknown',
          country: request.geo?.country || 'unknown',
          responseTime: `${responseTime}ms`,
          timestamp: new Date().toISOString(),
        },
      },
      {
        status: isHealthy ? 200 : 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Response-Time': `${responseTime}ms`,
        },
      }
    );
  } catch (error) {
    console.error('[HealthCheck] Error:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
