/**
 * Resources API - Main listing endpoint with pagination, filtering, sorting, and search
 *
 * GET /api/resources
 * Query params:
 * - category: Filter by category (default: 'all')
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 12, max: 50)
 * - type: Filter by resource type (default: 'all')
 * - sort: Sort order (default: 'newest') - options: newest, popular, relevance
 * - q: Search query (default: '')
 * - tags: Comma-separated tags
 */

import { NextRequest, NextResponse } from 'next/server';
import { resources, categories } from '@/lib/resourcesData';
import { Resource, ResourceCategory } from '@/types/resources';

// Types
interface ResourceQueryParams {
  category?: string;
  page?: number;
  limit?: number;
  type?: string;
  sort?: 'newest' | 'popular' | 'relevance';
  q?: string;
  tags?: string[];
}

interface PaginatedResponse {
  resources: Resource[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  categories: ResourceCategory[];
}

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: PaginatedResponse; timestamp: number }>();

function getCacheKey(params: ResourceQueryParams): string {
  return JSON.stringify(params);
}

function getFromCache(key: string): PaginatedResponse | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: PaginatedResponse): void {
  cache.set(key, { data, timestamp: Date.now() });
  // Limit cache size
  if (cache.size > 100) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params: ResourceQueryParams = {
      category: searchParams.get('category') || 'all',
      page: Math.max(1, parseInt(searchParams.get('page') || '1')),
      limit: Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12'))),
      type: searchParams.get('type') || 'all',
      sort: (searchParams.get('sort') as 'newest' | 'popular' | 'relevance') || 'newest',
      q: searchParams.get('q') || '',
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
    };

    // Check cache
    const cacheKey = getCacheKey(params);
    const cached = getFromCache(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    // Filter resources
    let filteredResources = [...resources];

    // Category filter
    if (params.category && params.category !== 'all') {
      filteredResources = filteredResources.filter(
        (r) => r.category === params.category
      );
    }

    // Type filter
    if (params.type && params.type !== 'all') {
      filteredResources = filteredResources.filter(
        (r) => r.type === params.type
      );
    }

    // Tags filter
    if (params.tags && params.tags.length > 0) {
      filteredResources = filteredResources.filter((r) =>
        params.tags!.some((tag) => r.keywords?.includes(tag))
      );
    }

    // Search filter
    if (params.q) {
      const query = params.q.toLowerCase();
      filteredResources = filteredResources.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.keywords?.some((k) => k.toLowerCase().includes(query))
      );
    }

    // Sort resources
    switch (params.sort) {
      case 'popular':
        filteredResources.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'relevance':
        // Keep search relevance order (no additional sorting)
        break;
      case 'newest':
      default:
        // Sort by id descending (assuming newer resources have higher IDs)
        filteredResources.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    // Calculate pagination
    const totalCount = filteredResources.length;
    const totalPages = Math.ceil(totalCount / params.limit!);
    const currentPage = Math.min(params.page!, totalPages || 1);

    // Paginate
    const startIndex = (currentPage - 1) * params.limit!;
    const endIndex = startIndex + params.limit!;
    const paginatedResources = filteredResources.slice(startIndex, endIndex);

    // Build response
    const response: PaginatedResponse = {
      resources: paginatedResources,
      totalCount,
      totalPages,
      currentPage,
      categories,
    };

    // Cache response
    setCache(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Resources API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// Enable caching
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes
