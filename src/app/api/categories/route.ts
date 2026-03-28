/**
 * Categories API - Category listing with resource counts
 *
 * GET /api/categories
 * Returns all categories with current resource counts
 */

import { NextRequest, NextResponse } from 'next/server';
import { categories, resources } from '@/lib/resourcesData';

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
  counts.set('all', resources.length);

  categoryCountsCache = counts;
  return counts;
}

export async function GET(request: NextRequest) {
  try {
    const counts = calculateCategoryCounts();

    // Enrich categories with counts
    const enrichedCategories = categories.map((cat) => ({
      ...cat,
      resourceCount: counts.get(cat.id) || 0,
    }));

    return NextResponse.json(enrichedCategories);
  } catch (error) {
    console.error('Categories API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Enable caching
export const dynamic = 'force-dynamic';
export const revalidate = 600; // 10 minutes
