/**
 * Categories API - Category listing with resource counts
 *
 * GET /api/categories
 *
 * Returns all categories with current resource counts
 *
 * @openapi
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     description: |
 *       Retrieve all resource categories with current resource counts.
 *
 *       **Rate Limit:** 100 requests per 5 minutes per IP
 *
 *       **Cache:** 10 minutes (600 seconds)
 *     tags:
 *       - Resources
 *     responses:
 *       '200':
 *         description: Successful response with categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Category slug
 *                   name:
 *                     type: string
 *                     description: Category display name
 *                   slug:
 *                     type: string
 *                     description: URL-friendly category identifier
 *                   icon:
 *                     type: string
 *                     description: Category icon emoji
 *                   resourceCount:
 *                     type: integer
 *                     description: Number of resources in category
 *       '500':
 *         description: Internal server error
 *
 * @param {NextRequest} request - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with categories
 */

import { NextRequest, NextResponse } from "next/server";
import { categories, resources } from "@/lib/resourcesData";
import { logger } from "@/lib/logger";

// Cache for category counts (update on resource changes)
let categoryCountsCache: Map<string, number> | null = null;

function calculateCategoryCounts(): Map<string, number> {
  if (categoryCountsCache) {
    return categoryCountsCache;
  }

  const counts = new Map<string, number>();

  // Count resources per category
  resources.forEach((resource) => {
    const currentCount = counts.get(resource.category) || 0;
    counts.set(resource.category, currentCount + 1);
  });

  // Add 'all' count
  counts.set("all", resources.length);

  categoryCountsCache = counts;
  return counts;
}

export async function GET(_request: NextRequest) {
  try {
    const counts = calculateCategoryCounts();

    // Enrich categories with counts
    const enrichedCategories = categories.map((cat) => ({
      ...cat,
      resourceCount: counts.get(cat.id) || 0,
    }));

    return NextResponse.json(enrichedCategories);
  } catch (error) {
    logger.error(
      "Categories API error",
      { endpoint: "/api/categories" },
      error as Error,
    );
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

// Enable caching
export const revalidate = 600; // 10 minutes
