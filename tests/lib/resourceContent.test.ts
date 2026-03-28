/**
 * Resource Content Loading Tests
 * Tests for resource content loading system
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock fs module at top level
vi.mock('fs');
vi.mock('path');

// Mock logger at top level
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

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
    // Clear cache between tests
    vi.resetModules();
  });

  describe('getResourceContent', () => {
    it('should load resource content from file system', async () => {
      const mockContent = '# Test Content\n\nThis is test content.';
      const mockMatter = {
        content: mockContent,
        data: {
          title: 'Test Resource',
          date: '2024-01-01',
          author: 'Test Author',
        },
      };

      vi.doMock('gray-matter', () => ({
        default: vi.fn(() => mockMatter),
      }));

      const { getResourceContent } = await import('@/lib/resourceContent');

      // Mock fs.existsSync to return true
      vi.mocked(fs.existsSync).mockReturnValue(true);

      // Mock fs.readFileSync to return content
      vi.mocked(fs.readFileSync).mockReturnValue('---\ntitle: Test\n---\n# Content');

      const result = await getResourceContent(mockResource as any);

      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('metadata');
      expect(result.content).toBeDefined();
    });

    it('should cache loaded content', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('---\ntitle: Test\n---\n# Content');

      // First call
      await getResourceContent(mockResource as any);

      // Second call should use cache
      await getResourceContent(mockResource as any);

      // Should only read file once due to caching
      expect(fs.readFileSync).toHaveBeenCalledTimes(1);
    });

    it('should throw error if content file not found', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(false);

      await expect(getResourceContent(mockResource as any)).rejects.toThrow();
    });

    it('should parse frontmatter metadata', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue(
        '---\ntitle: Test Title\ndate: 2024-01-01\nauthor: Test Author\n---\n# Content'
      );

      const result = await getResourceContent(mockResource as any);

      expect(result.metadata).toHaveProperty('title');
      expect(result.metadata).toHaveProperty('date');
      expect(result.metadata).toHaveProperty('author');
    });

    it('should handle empty content files', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('');

      const result = await getResourceContent(mockResource as any);

      expect(result.content).toBe('');
    });

    it('should handle malformed frontmatter', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('Invalid frontmatter\n# Content');

      // Should still return content even if frontmatter is invalid
      const result = await getResourceContent(mockResource as any);

      expect(result).toBeDefined();
    });
  });

  describe('Cache Management', () => {
    it('should invalidate cache after TTL', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('# Content');

      // First call
      await getResourceContent(mockResource as any);

      // Mock time passing beyond TTL (5 minutes)
      vi.useFakeTimers();
      vi.advanceTimersByTime(6 * 60 * 1000);

      // Second call should bypass expired cache
      await getResourceContent(mockResource as any);

      expect(fs.readFileSync).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });

    it('should cache multiple resources separately', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('# Content');

      const resource1 = { ...mockResource, slug: 'resource-1' };
      const resource2 = { ...mockResource, slug: 'resource-2' };

      await getResourceContent(resource1 as any);
      await getResourceContent(resource2 as any);

      // Should read file twice (different resources)
      expect(fs.readFileSync).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling', () => {
    it('should handle file read errors', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('File read error');
      });

      await expect(getResourceContent(mockResource as any)).rejects.toThrow();
    });

    it('should log errors appropriately', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');
      const { logger } = await import('@/lib/logger');

      vi.mocked(fs.existsSync).mockReturnValue(false);

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

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('# Content');
      vi.mocked(path.join).mockReturnValue('/content/resources/mindful-leadership/test-resource.md');

      await getResourceContent(mockResource as any);

      expect(path.join).toHaveBeenCalledWith(
        expect.any(String),
        'content',
        'resources',
        'mindful-leadership',
        'test-resource.md'
      );
    });

    it('should handle different resource categories', async () => {
      const { getResourceContent } = await import('@/lib/resourceContent');

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readFileSync).mockReturnValue('# Content');

      const aiResource = { ...mockResource, category: 'ai-automation', slug: 'ai-guide' };

      await getResourceContent(aiResource as any);

      expect(path.join).toHaveBeenCalledWith(
        expect.any(String),
        'content',
        'resources',
        'ai-automation',
        'ai-guide.md'
      );
    });
  });
});
