/**
 * Edge Function: Analytics event tracking
 *
 * Runtime: Edge (Vercel Edge Network)
 * Purpose: Track analytics events at the edge for performance
 * Cache: No cache (events must be tracked immediately)
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * Event schema validation
 */
interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, string | number | boolean>;
  timestamp: string;
  url: string;
  userAgent: string;
  geo: {
    country?: string;
    region?: string;
    city?: string;
  };
  ip: string;
}

/**
 * POST handler - Track analytics events
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    // Build event object
    const event: AnalyticsEvent = {
      name: body.name,
      category: body.category || 'general',
      label: body.label,
      value: body.value,
      properties: body.properties || {},
      timestamp: new Date().toISOString(),
      url: body.url || request.url,
      userAgent: request.headers.get('user-agent') || 'unknown',
      geo: {
        country: request.geo?.country,
        region: request.geo?.region,
        city: request.geo?.city,
      },
      ip:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown',
    };

    // In production, send to analytics platform
    // await sendToAnalytics(event);

    // For now, just log the event (remove in production)
    console.log('[Analytics] Event:', {
      name: event.name,
      category: event.category,
      geo: event.geo.country,
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Event tracked',
      },
      {
        status: 202,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-Edge-Location': request.geo?.region || 'unknown',
        },
      }
    );
  } catch (error) {
    console.error('[Analytics] Error:', error);

    return NextResponse.json(
      {
        error: 'Failed to track event',
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Return analytics tracking status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json(
    {
      status: 'operational',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60',
      },
    }
  );
}
