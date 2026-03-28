/**
 * Resource Content Loading System
 *
 * Server-side markdown content loading from /content/resources/
 * with proper caching and error handling.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  Resource,
  ResourceContentMetadata,
  ResourceWithContent,
} from "@/types/resources";
import { logger } from "@/lib/logger";

/**
 * Content cache for optimization
 * In production, this could be replaced with Redis or similar
 */
const contentCache = new Map<string, CacheEntry>();

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
 * Loads markdown content from the filesystem, parses frontmatter metadata,
 * and caches the result for performance. Throws descriptive errors for
 * missing or invalid content files.
 *
 * @param resource - Resource object containing category, slug, and optional contentPath
 * @returns Promise resolving to ResourceWithContent (resource + parsed content + metadata)
 * @throws {Error} When content file is not found or cannot be parsed
 *
 * @example
 * const resource = { slug: 'my-resource', category: 'guides', title: 'My Guide' };
 * const withContent = await getResourceContent(resource);
 * console.log(withContent.content); // Markdown content
 * console.log(withContent.metadata); // Parsed frontmatter
 */
export async function getResourceContent(
  resource: Resource,
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
  const fullPath = path.join(
    process.cwd(),
    "src",
    "content",
    "resources",
    contentPath,
  );

  try {
    // Read file
    const fileContent = fs.readFileSync(fullPath, "utf-8");

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
      if (error.message.includes("no such file")) {
        logger.error(`[ResourceContent] File not found: ${fullPath}`, {
          slug: resource.slug,
        });
        throw new Error(`Resource content not found: ${resource.slug}`);
      }
      logger.error(
        `[ResourceContent] Error loading resource:`,
        { slug: resource.slug },
        error,
      );
      throw error;
    }
    throw new Error(`Failed to load resource content: ${resource.slug}`);
  }
}

/**
 * Get resource content synchronously from cache (client-side only)
 *
 * This is a synchronous function that only returns cached content.
 * It does not perform filesystem I/O and is safe to use in client components.
 * Returns null if the content is not cached or has expired.
 *
 * @param resource - Resource object containing category and slug
 * @returns Cached content string, or null if not in cache or expired
 *
 * @example
 * const content = getResourceContentSync(resource);
 * if (content) {
 *   // Use cached content
 * } else {
 *   // Content not cached - need to load on server
 * }
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
  const fullPath = path.join(
    process.cwd(),
    "src",
    "content",
    "resources",
    contentPath,
  );

  try {
    return fs.existsSync(fullPath);
  } catch {
    return false;
  }
}

/**
 * Clear the entire content cache
 *
 * Removes all cached content entries. Useful for:
 * - Testing: Reset cache state between tests
 * - Forced refresh: Ensure fresh content after updates
 * - Memory management: Free up memory when needed
 *
 * @example
 * // After updating content files
 * clearContentCache();
 * // Next load will fetch fresh content
 */
export function clearContentCache(): void {
  contentCache.clear();
}

/**
 * Get cache statistics for monitoring and debugging
 *
 * Returns information about the current state of the content cache,
 * including the number of cached entries and their keys.
 *
 * @returns Object containing cache size (number of entries) and array of cache keys
 *
 * @example
 * const stats = getCacheStats();
 * console.log(`Cached ${stats.size} resources`);
 * console.log('Keys:', stats.keys);
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: contentCache.size,
    keys: Array.from(contentCache.keys()),
  };
}

/**
 * Preload content for multiple resources in parallel
 *
 * Optimizes build-time performance by loading multiple resources
 * concurrently using Promise.all(). Logs errors for individual
 * failures but continues loading other resources.
 *
 * @param resources - Array of Resource objects to preload
 * @returns Promise resolving to Map of resource slugs to ResourceWithContent
 *
 * @example
 * const allResources = await getAllResources();
 * const preloaded = await preloadResourceContents(allResources);
 * console.log(`Preloaded ${preloaded.size} resources`);
 *
 * @remarks
 * - Individual failures don't reject the entire batch
 * - Failed resources are logged but not included in results
 * - Useful for static site generation and build optimization
 */
export async function preloadResourceContents(
  resources: Resource[],
): Promise<Map<string, ResourceWithContent>> {
  const results = new Map<string, ResourceWithContent>();

  await Promise.all(
    resources.map(async (resource) => {
      try {
        const withContent = await getResourceContent(resource);
        results.set(resource.slug, withContent);
      } catch (error) {
        logger.error(
          `[ResourceContent] Failed to preload ${resource.slug}:`,
          { slug: resource.slug },
          error instanceof Error ? error : undefined,
        );
      }
    }),
  );

  return results;
}
