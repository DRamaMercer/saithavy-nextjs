/**
 * Save/Bookmark API - Toggle resource bookmark
 *
 * POST /api/resources/[slug]/save
 * Toggles the saved/bookmarked state of a resource
 * Note: Currently uses localStorage as fallback. User auth required for persistent saves.
 */

import { NextRequest, NextResponse } from "next/server";
import { getResourceBySlug } from "@/lib/resourcesData";
import { logger } from "@/lib/logger";

// Types
interface SaveResponse {
  saved: boolean;
  resourceSlug: string;
  message?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    // Validate resource exists
    const resource = getResourceBySlug(slug);
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 },
      );
    }

    // TODO: Integrate with user auth system
    // For now, return success - client handles localStorage
    const response: SaveResponse = {
      saved: true,
      resourceSlug: slug,
      message: "Resource saved successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    logger.error("Save API error", { slug }, error as Error);
    return NextResponse.json(
      { error: "Failed to save resource" },
      { status: 500 },
    );
  }
}

// Enable caching (disabled for mutations)
export const dynamic = "force-dynamic";
