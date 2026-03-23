/**
 * Resource Content Loading System
 *
 * Server-side markdown content loading from /content/resources/
 * with proper caching and error handling.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Resource, ResourceContentMetadata, ResourceWithContent } from '@/types/resources';

/**
 * Content cache for optimization
 * In production, this could be replaced with Redis or similar
 */
const contentCache = new Map<string, { content: string; metadata: ResourceContentMetadata }>();

/**
 * Cache TTL in milliseconds (5 minutes)
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Cache entry with timestamp
 */
interface CacheEntry {
  data: { content: string; metadata: ResourceContentMetadata };
  timestamp: number;
}

/**
 * Get resource content with metadata
 *
 * @param resource - Resource object containing contentPath
 * @returns Resource with content and metadata
 * @throws Error if content file not found or invalid
 */
export async function getResourceContent(
  resource: Resource
): Promise<ResourceWithContent> {
  const cacheKey = `${resource.category}/${resource.slug}`;

  // Check cache
  const cached = contentCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return {
      ...resource,
      content: cached.data.content,
      metadata: cached.data.metadata,
    };
  }

  // Build file path
  const contentPath = resource.contentPath || buildDefaultContentPath(resource);
  const fullPath = path.join(process.cwd(), 'src', 'content', 'resources', contentPath);

  try {
    // Read file
    const fileContent = fs.readFileSync(fullPath, 'utf-8');

    // Parse frontmatter
    const { data, content } = matter(fileContent);

    // Validate metadata
    const metadata: ResourceContentMetadata = {
      title: data.title || resource.title,
      description: data.description || resource.description,
      category: data.category || resource.category,
      type: data.type || resource.type,
      featured: data.featured ?? resource.featured,
      difficulty: data.difficulty || resource.difficulty,
      timeToRead: data.timeToRead || resource.timeToRead,
      targetAudience: data.targetAudience || resource.targetAudience,
      keywords: data.keywords || resource.keywords,
      lastUpdated: data.lastUpdated || new Date().toISOString(),
    };

    // Cache the result
    contentCache.set(cacheKey, {
      data: { content, metadata },
      timestamp: Date.now(),
    });

    return {
      ...resource,
      content,
      metadata,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('no such file')) {
        console.error(`[ResourceContent] File not found: ${fullPath}`);
        throw new Error(`Resource content not found: ${resource.slug}`);
      }
      console.error(`[ResourceContent] Error loading resource:`, error);
      throw error;
    }
    throw new Error(`Failed to load resource content: ${resource.slug}`);
  }
}

/**
 * Get resource content synchronously (for client-side)
 * Only returns cached content
 *
 * @param resource - Resource object
 * @returns Content string or empty string if not cached
 */
export function getResourceContentSync(resource: Resource): string | null {
  const cacheKey = `${resource.category}/${resource.slug}`;
  const cached = contentCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data.content;
  }

  return null;
}

/**
 * Build default content path from resource metadata
 *
 * @param resource - Resource object
 * @returns Relative path to content file
 */
function buildDefaultContentPath(resource: Resource): string {
  // Default path pattern: {category}/{slug}.md
  return path.join(resource.category, `${resource.slug}.md`);
}

/**
 * Check if resource content exists
 *
 * @param resource - Resource object
 * @returns True if content file exists
 */
export function resourceContentExists(resource: Resource): boolean {
  const contentPath = resource.contentPath || buildDefaultContentPath(resource);
  const fullPath = path.join(process.cwd(), 'src', 'content', 'resources', contentPath);

  try {
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}

/**
 * Clear content cache
 * Useful for testing or forced refresh
 */
export function clearContentCache(): void {
  contentCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: contentCache.size,
    keys: Array.from(contentCache.keys()),
  };
}

/**
 * Preload content for multiple resources
 * Useful for build-time optimization
 *
 * @param resources - Array of resources to preload
 * @returns Map of resource slugs to loaded content
 */
export async function preloadResourceContents(
  resources: Resource[]
): Promise<Map<string, ResourceWithContent>> {
  const results = new Map<string, ResourceWithContent>();

  await Promise.all(
    resources.map(async (resource) => {
      try {
        const withContent = await getResourceContent(resource);
        results.set(resource.slug, withContent);
      } catch (error) {
        console.error(`[ResourceContent] Failed to preload ${resource.slug}:`, error);
      }
    })
  );

  return results;
}
