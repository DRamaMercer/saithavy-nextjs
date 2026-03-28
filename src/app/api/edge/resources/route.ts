/**
 * Edge Function: Resource availability checker
 *
 * Runtime: Edge (Vercel Edge Network)
 * Purpose: Check if resources are available based on user location
 * Cache: 1 hour
 */

import { NextRequest, NextResponse } from 'next/server';
import { resources } from '@/lib/resourcesData';

export const runtime = 'edge';

/**
 * Country-specific resource restrictions
 * Example: Some resources might be restricted due to licensing
 */
const REGION_RESTRICTIONS: Record<string, string[]> = {
  // Example: Restrict certain resources in specific countries
  // 'CU': ['1', '2'], // Restrict resources 1 and 2 in Cuba
  // 'IR': ['3'],      // Restrict resource 3 in Iran
};

/**
 * GET handler - Returns available resources for the user's region
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get country from headers (Vercel provides these)
    const country = request.headers.get('x-vercel-ip-country') || 'US';
    const region = request.headers.get('x-vercel-ip-region') || 'unknown';

    // Get restricted resources for this country (if any)
    const restrictedResourceIds = REGION_RESTRICTIONS[country] || [];

    // Filter available resources
    const availableResources = resources
      .filter((resource) => !restrictedResourceIds.includes(resource.id))
      .map((resource) => ({
        id: resource.id,
        slug: resource.slug,
        title: resource.title,
        description: resource.description,
        category: resource.category,
        type: resource.type,
        difficulty: resource.difficulty,
        timeToRead: resource.timeToRead,
        featured: resource.featured,
        downloads: resource.downloads,
      }));

    // Build response
    const data = {
      country,
      region,
      total: availableResources.length,
      restricted: restrictedResourceIds.length,
      resources: availableResources,
      timestamp: new Date().toISOString(),
    };

    // Cache for 1 hour
    const response = NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Content-Location': country,
        'X-Edge-Location': region,
      },
    });

    return response;
  } catch (error) {
    console.error('[ResourceAvailability] Error:', error);

    const country = request.headers.get('x-vercel-ip-country') || 'US';
    return NextResponse.json(
      {
        error: 'Failed to check resource availability',
        country,
      },
      { status: 500 }
    );
  }
}
