/**
 * Edge Function: Resource availability checker
 *
 * Runtime: Edge (Vercel Edge Network)
 * Purpose: Check if resources are available based on user location
 * Cache: 1 hour
 */

import { NextRequest, NextResponse } from "next/server";
import { resources } from "@/lib/resourcesData";
import { edgeLogger } from "@/lib/edge-logger";

export const runtime = "edge";

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
    const country = request.headers.get("x-vercel-ip-country") || "US";
    const region = request.headers.get("x-vercel-ip-region") || "unknown";

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

    // Cache for 10 minutes with stale-while-revalidate
    const response = NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=1200", // 10 min cache, 20 min SWR
        "X-Content-Location": country,
        "X-Edge-Location": region,
      },
    });

    return response;
  } catch (error) {
    edgeLogger.error(
      "[ResourceAvailability] Error",
      { country: request.headers.get("x-vercel-ip-country") },
      error as Error,
    );

    const country = request.headers.get("x-vercel-ip-country") || "US";
    return NextResponse.json(
      {
        error: "Failed to check resource availability",
        country,
      },
      { status: 500 },
    );
  }
}
