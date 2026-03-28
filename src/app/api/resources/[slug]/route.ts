/**
 * Single Resource API - Get resource details by slug
 *
 * GET /api/resources/[slug]
 * Returns full resource with content, related resources
 */

import { NextRequest, NextResponse } from 'next/server';
import { getResourceBySlug, getRelatedResources } from '@/lib/resourcesData';
import { Resource } from '@/types/resources';

// Types
interface ResourceDetailResponse {
  resource: Resource | null;
  related: Resource[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get resource by slug
    const resource = getResourceBySlug(slug);

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
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
    console.error('Resource detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

// Enable caching
export const dynamic = 'force-dynamic';
export const revalidate = 600; // 10 minutes
