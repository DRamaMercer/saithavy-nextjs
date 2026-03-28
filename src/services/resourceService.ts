/**
 * Resource Service - Data layer abstraction for resources
 *
 * Provides a clean API for resource-related operations
 */

import { Resource, ResourceCategory } from '@/types/resources';

export interface ResourceQueryParams {
  category?: string;
  page?: number;
  limit?: number;
  type?: string;
  sort?: 'newest' | 'popular' | 'relevance';
  q?: string;
  tags?: string[];
}

export interface PaginatedResponse {
  resources: Resource[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  categories: ResourceCategory[];
}

export interface ResourceDetail {
  resource: Resource | null;
  related: Resource[];
}

const API_BASE = '/api';

/**
 * Fetch resources with pagination, filtering, sorting, and search
 */
export async function getResources(
  params: ResourceQueryParams = {}
): Promise<PaginatedResponse> {
  const queryParams = new URLSearchParams();

  if (params.category && params.category !== 'all') {
    queryParams.set('category', params.category);
  }
  if (params.page && params.page > 1) {
    queryParams.set('page', params.page.toString());
  }
  if (params.limit && params.limit !== 12) {
    queryParams.set('limit', params.limit.toString());
  }
  if (params.type && params.type !== 'all') {
    queryParams.set('type', params.type);
  }
  if (params.sort && params.sort !== 'newest') {
    queryParams.set('sort', params.sort);
  }
  if (params.q) {
    queryParams.set('q', params.q);
  }
  if (params.tags && params.tags.length > 0) {
    queryParams.set('tags', params.tags.join(','));
  }

  const queryString = queryParams.toString();
  const url = `${API_BASE}/resources${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch resources');
  }

  return response.json();
}

/**
 * Fetch single resource by slug with related resources
 */
export async function getResourceBySlug(slug: string): Promise<ResourceDetail> {
  const response = await fetch(`${API_BASE}/resources/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch resource');
  }

  return response.json();
}

/**
 * Fetch all categories with counts
 */
export async function getCategories(): Promise<ResourceCategory[]> {
  const response = await fetch(`${API_BASE}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }

  return response.json();
}

/**
 * Toggle save/bookmark for a resource
 */
export async function toggleSave(resourceId: string): Promise<{ saved: boolean }> {
  const response = await fetch(`${API_BASE}/resources/${resourceId}/save`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to save resource');
  }

  return response.json();
}

/**
 * Search resources (shortcut with debounce consideration)
 */
export async function searchResources(
  query: string,
  signal?: AbortSignal
): Promise<Resource[]> {
  const response = await fetch(
    `${API_BASE}/resources?q=${encodeURIComponent(query)}&limit=20`,
    { signal }
  );

  if (!response.ok) {
    throw new Error('Failed to search resources');
  }

  const data = await response.json();
  return data.resources;
}
