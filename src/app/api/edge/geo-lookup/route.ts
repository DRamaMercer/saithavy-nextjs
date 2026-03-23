/**
 * Edge Function: IP Geolocation Lookup
 *
 * Runtime: Edge (Vercel Edge Network)
 * Purpose: Return geolocation data for the client
 * Cache: 5 minutes with stale-while-revalidate
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * GET handler - Returns geolocation information
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Extract IP address
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      'unknown';

    // Get geolocation from request metadata (Vercel provides this)
    const geo = {
      country: request.geo?.country || null,
      country_code: request.geo?.country || null,
      region: request.geo?.region || null,
      city: request.geo?.city || null,
      latitude: request.geo?.latitude || null,
      longitude: request.geo?.longitude || null,
    };

    // Build response
    const data = {
      ip,
      geo,
      timestamp: new Date().toISOString(),
    };

    // Cache based on IP (5 minutes)
    const response = NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Edge-Location': geo.region || 'unknown',
      },
    });

    return response;
  } catch (error) {
    console.error('[GeoLookup] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to lookup geolocation',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      },
      { status: 500 }
    );
  }
}
