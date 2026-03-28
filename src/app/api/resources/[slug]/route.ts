/**
 * Single Resource API - Get resource details by slug
 *
 * GET /api/resources/[slug]
 * Returns full resource with content, related resources
 */

import { NextRequest, NextResponse } from "next/server";
import { getResourceBySlug, getRelatedResources } from "@/lib/resourcesData";
import { Resource } from "@/types/resources";
import { logger } from "@/lib/logger";

// Types
interface ResourceDetailResponse {
  resource: Resource | null;
  related: Resource[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    // Get resource by slug
    const resource = getResourceBySlug(slug);

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    // Get related resources
    const related = getRelatedResources(resource, 4);

    // Build response
    const response: ResourceDetailResponse = {
      resource,
      related,
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Resource detail API error", { slug }, error as Error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 },
    );
  }
}

// Enable caching
export const revalidate = 600; // 10 minutes
