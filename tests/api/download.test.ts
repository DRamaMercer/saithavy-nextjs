/**
 * Download API Route Tests
 * Tests for /api/download endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/download/route';
import { NextRequest } from 'next/server';

// Mock the rate limiter dependency used by the route
vi.mock('@/lib/di/services', () => ({
  resolveRateLimiter: vi.fn().mockResolvedValue({
    checkLimit: vi.fn().mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Date.now() + 3600000,
    }),
  }),
}));

// Mock logger to avoid console output in tests
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

describe('Download API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (body: Record<string, unknown>): NextRequest => {
    return {
      json: async () => body,
      headers: new Headers(),
      url: 'http://localhost:3000/api/download',
    } as unknown as NextRequest;
  };

  describe('POST /api/download', () => {
    it('should accept valid download request', async () => {
      const validData = {
        email: 'john@example.com',
        resourceId: 'mindful-leadership-reflection-journal',
        format: 'pdf',
      };

      const response = await POST(createMockRequest(validData));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.downloadUrl).toBe('/resources/mindful-leadership-reflection-journal/download?format=pdf');
    });

    it('should accept optional firstName field', async () => {
      const validData = {
        firstName: 'John',
        email: 'john@example.com',
        resourceId: 'test-resource',
        format: 'web',
      };

      const response = await POST(createMockRequest(validData));
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should reject missing email', async () => {
      const invalidData = {
        resourceId: 'test-resource',
        format: 'pdf',
      };

      const response = await POST(createMockRequest(invalidData));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
      expect(data.issues).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        email: 'not-an-email',
        resourceId: 'test-resource',
        format: 'pdf',
      };

      const response = await POST(createMockRequest(invalidData));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject missing resourceId', async () => {
      const invalidData = {
        email: 'john@example.com',
        format: 'pdf',
      };

      const response = await POST(createMockRequest(invalidData));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject missing format', async () => {
      const invalidData = {
        email: 'john@example.com',
        resourceId: 'test-resource',
      };

      const response = await POST(createMockRequest(invalidData));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should reject invalid format value', async () => {
      const invalidData = {
        email: 'john@example.com',
        resourceId: 'test-resource',
        format: 'docx',
      };

      const response = await POST(createMockRequest(invalidData));
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBeDefined();
    });

    it('should accept all valid format values', async () => {
      for (const fmt of ['pdf', 'web', 'print']) {
        const data = {
          email: 'john@example.com',
          resourceId: 'test-resource',
          format: fmt,
        };

        const response = await POST(createMockRequest(data));
        expect(response.status).toBe(200);
      }
    });

    it('should include rate limit headers on success', async () => {
      const validData = {
        email: 'john@example.com',
        resourceId: 'test-resource',
        format: 'pdf',
      };

      const response = await POST(createMockRequest(validData));

      expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('4');
      expect(response.headers.get('X-RateLimit-Reset')).toBeDefined();
    });

    it('should handle rate limiting', async () => {
      const { resolveRateLimiter } = await import('@/lib/di/services');
      vi.mocked(resolveRateLimiter).mockResolvedValueOnce({
        checkLimit: vi.fn().mockResolvedValue({
          success: false,
          limit: 5,
          remaining: 0,
          reset: Date.now() + 3600000,
          retryAfter: 3600,
        }),
      });

      const validData = {
        email: 'john@example.com',
        resourceId: 'test-resource',
        format: 'pdf',
      };

      const response = await POST(createMockRequest(validData));
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toContain('Too many download attempts');
      expect(data.retryAfter).toBeDefined();
    });

    it('should include rate limit headers on 429 response', async () => {
      const { resolveRateLimiter } = await import('@/lib/di/services');
      vi.mocked(resolveRateLimiter).mockResolvedValueOnce({
        checkLimit: vi.fn().mockResolvedValue({
          success: false,
          limit: 5,
          remaining: 0,
          reset: Date.now() + 3600000,
          retryAfter: 3600,
        }),
      });

      const validData = {
        email: 'john@example.com',
        resourceId: 'test-resource',
        format: 'pdf',
      };

      const response = await POST(createMockRequest(validData));

      expect(response.headers.get('X-RateLimit-Limit')).toBe('5');
      expect(response.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response.headers.get('Retry-After')).toBe('3600');
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parse errors as 500', async () => {
      const badRequest = {
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers(),
        url: 'http://localhost:3000/api/download',
      } as unknown as NextRequest;

      const response = await POST(badRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });

    it('should return 500 when rate limiter throws', async () => {
      const { resolveRateLimiter } = await import('@/lib/di/services');
      vi.mocked(resolveRateLimiter).mockRejectedValueOnce(new Error('Redis down'));

      const validData = {
        email: 'john@example.com',
        resourceId: 'test-resource',
        format: 'pdf',
      };

      const response = await POST(createMockRequest(validData));
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBeDefined();
    });
  });
});
