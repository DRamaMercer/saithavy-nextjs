/**
 * Resource Content Loading Tests
 * Tests for resource content loading system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';

// Mock gray-matter with a simple frontmatter parser
vi.mock('gray-matter', () => ({
  default: vi.fn((content: string) => {
    if (!content || content.trim() === '') {
      return { data: {}, content: '' };
    }
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (fmMatch) {
      const data: Record<string, string> = {};
      fmMatch[1].split('\n').forEach((line: string) => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          data[key.trim()] = valueParts.join(':').trim();
        }
      });
      return { data, content: fmMatch[2] };
    }
    return { data: {}, content };
  }),
}));

// Mock logger at top level
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock fs with importOriginal to preserve the module structure
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>();
  return {
    ...actual,
    default: {
      ...actual,
      existsSync: vi.fn(),
      readFileSync: vi.fn(),
    },
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
  };
});

// Import fs after mocking to get the mock functions
import fs from 'fs';

const mockExistsSync = vi.mocked(fs.existsSync);
const mockReadFileSync = vi.mocked(fs.readFileSync);

describe('Resource Content Loading', () => {
  const mockResource = {
    id: 'test-resource',
    slug: 'test-resource',
    title: 'Test Resource',
    description: 'A test resource',
    category: 'mindful-leadership',
    type: 'PDF',
    featured: false,
    downloads: 1000,
    difficulty: 'Beginner',
    timeToRead: '15 min',
    targetAudience: 'Everyone',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('getResourceContent', () => {
    it('should load resource content from file system', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue('---\ntitle: Test\n---\n# Content' as any);

      const result = await getResourceContent(mockResource as any);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('metadata');
      expect(result.content).toBeDefined();
    });

    it('should cache loaded content', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue('---\ntitle: Test\n---\n# Content' as any);

      // First call
      await getResourceContent(mockResource as any);

      // Second call should use cache
      await getResourceContent(mockResource as any);

      // Should only read file once due to caching
      expect(mockReadFileSync).toHaveBeenCalledTimes(1);
    });

    it('should throw error if content file not found', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      await expect(getResourceContent(mockResource as any)).rejects.toThrow();
    });

    it('should parse frontmatter metadata', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue(
        '---\ntitle: Test Title\ndescription: A test description\ncategory: test-category\n---\n# Content' as any
      );

      const result = await getResourceContent(mockResource as any);

      expect(result.metadata).toHaveProperty('title');
      expect(result.metadata.title).toBe('Test Title');
      expect(result.metadata).toHaveProperty('description');
      expect(result.metadata).toHaveProperty('category');
    });

    it('should handle empty content files', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue('' as any);

      const result = await getResourceContent(mockResource as any);

      expect(result.content).toBe('');
    });

    it('should handle malformed frontmatter', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue('Invalid frontmatter\n# Content' as any);

      // Should still return content even if frontmatter is invalid
      const result = await getResourceContent(mockResource as any);

      expect(result).toBeDefined();
    });
  });

  describe('Cache Management', () => {
    it('should invalidate cache after TTL', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue('# Content' as any);

      // First call
      await getResourceContent(mockResource as any);

      // Mock time passing beyond TTL (5 minutes)
      vi.useFakeTimers();
      vi.advanceTimersByTime(6 * 60 * 1000);

      // Second call should bypass expired cache
      await getResourceContent(mockResource as any);

      expect(mockReadFileSync).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });

    it('should cache multiple resources separately', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue('# Content' as any);

      const resource1 = { ...mockResource, slug: 'resource-1' };
      const resource2 = { ...mockResource, slug: 'resource-2' };

      await getResourceContent(resource1 as any);
      await getResourceContent(resource2 as any);

      // Should read file twice (different resources)
      expect(mockReadFileSync).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle file read errors', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      await expect(getResourceContent(mockResource as any)).rejects.toThrow();
    });

    it('should log errors appropriately', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');
      const { logger } = await import('@/lib/logger');

      mockReadFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      try {
        await getResourceContent(mockResource as any);
      } catch (e) {
        // Expected to throw
      }

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('Path Resolution', () => {
    it('should resolve correct content path', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue('# Content' as any);

      const joinSpy = vi.spyOn(path, 'join');

      await getResourceContent(mockResource as any);

      // Verify path.join was called with the full path components (last call is the full path)
      const calls = joinSpy.mock.calls;
      const lastCall = calls[calls.length - 1];
      // Full path should contain src/content/resources and the category/slug
      expect(lastCall).toContain('src');
      expect(lastCall).toContain('content');
      expect(lastCall).toContain('resources');
      const joinedPath = path.join(...lastCall);
      expect(joinedPath).toContain('mindful-leadership');
      expect(joinedPath).toContain('test-resource.md');
    });

    it('should handle different resource categories', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      mockReadFileSync.mockReturnValue('# Content' as any);

      const joinSpy = vi.spyOn(path, 'join');

      const aiResource = { ...mockResource, category: 'ai-automation', slug: 'ai-guide' };

      await getResourceContent(aiResource as any);

      const calls = joinSpy.mock.calls;
      const lastCall = calls[calls.length - 1];
      expect(lastCall).toContain('src');
      expect(lastCall).toContain('content');
      expect(lastCall).toContain('resources');
      const joinedPath = path.join(...lastCall);
      expect(joinedPath).toContain('ai-automation');
      expect(joinedPath).toContain('ai-guide.md');
    });
  });
});
