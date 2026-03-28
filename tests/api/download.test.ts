/**
 * Download API Route Tests
 * Tests for /api/download endpoint
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/download/route';
import { NextRequest } from 'next/server';

// Mock dependencies at top level
vi.mock('@/lib/di/types', () => ({
  getService: vi.fn(() => ({
    checkLimit: vi.fn().mockResolvedValue({ success: true, limit: 5, remaining: 4, reset: Date.now() + 3600000 }),
  })),
}));

vi.mock('@/lib/api/lead-capture', () => ({
  captureLead: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('@/lib/edge-logger', () => ({
  logAction: vi.fn(),
  logError: vi.fn(),
}));

describe('Download API', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: async () => body,
      headers: new Headers(),
      url: 'http://localhost:3000/api/download',
    } as NextRequest;
  };

  describe('POST /api/download', () => {
    it('should accept valid download request', async () => {
      const validData = {
        firstName: 'John',
        email: 'john@example.com',
        resourceSlug: 'mindful-leadership-reflection-journal',
      };

      mockRequest = createMockRequest(validData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('should reject missing firstName', async () => {
      const invalidData = {
        email: 'john@example.com',
        resourceSlug: 'test-resource',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should reject missing email', async () => {
      const invalidData = {
        firstName: 'John',
        resourceSlug: 'test-resource',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        firstName: 'John',
        email: 'not-an-email',
        resourceSlug: 'test-resource',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject missing resourceSlug', async () => {
      const invalidData = {
        firstName: 'John',
        email: 'john@example.com',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should enforce firstName length limits', async () => {
      const invalidData = {
        firstName: 'A'.repeat(51), // Max 50
        email: 'john@example.com',
        resourceSlug: 'test-resource',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should enforce email length limits', async () => {
      const invalidData = {
        firstName: 'John',
        email: `${'a'.repeat(100)}@example.com`, // Too long
        resourceSlug: 'test-resource',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should handle rate limiting', async () => {
      const validData = {
        firstName: 'John',
        email: 'john@example.com',
        resourceSlug: 'test-resource',
      };

      mockRequest = createMockRequest(validData);

      // Mock rate limit exceeded
      const { getService } = await import('@/lib/di/types');
      vi.mocked(getService).mockReturnValue({
        checkLimit: vi.fn().mockResolvedValue({ success: false, limit: 5, remaining: 0, reset: Date.now() + 3600000 }),
      } as any);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(response.status).toBe(429);
    });

    it('should sanitize firstName input', async () => {
      const xssData = {
        firstName: '<script>alert("xss")</script>',
        email: 'john@example.com',
        resourceSlug: 'test-resource',
      };

      mockRequest = createMockRequest(xssData);
      const response = await POST(mockRequest);

      // Should handle gracefully
      expect(response.status).not.toBe(500);
    });
  });

  describe('Lead Capture Integration', () => {
    it('should call lead capture service on valid request', async () => {
      const validData = {
        firstName: 'John',
        email: 'john@example.com',
        resourceSlug: 'mindful-leadership-reflection-journal',
      };

      mockRequest = createMockRequest(validData);
      await POST(mockRequest);

      const { captureLead } = await import('@/lib/api/lead-capture');
      expect(captureLead).toHaveBeenCalledWith({
        firstName: 'John',
        email: 'john@example.com',
        resourceSlug: 'mindful-leadership-reflection-journal',
        source: 'download',
      });
    });

    it('should handle lead capture failures gracefully', async () => {
      const validData = {
        firstName: 'John',
        email: 'john@example.com',
        resourceSlug: 'test-resource',
      };

      mockRequest = createMockRequest(validData);

      // Mock lead capture failure
      const { captureLead } = await import('@/lib/api/lead-capture');
      vi.mocked(captureLead).mockRejectedValueOnce(new Error('Database error'));

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(response.status).toBe(500);
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parse errors', async () => {
      const badRequest = {
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers(),
        url: 'http://localhost:3000/api/download',
      } as NextRequest;

      const response = await POST(badRequest);
      expect(response.status).toBe(400);
    });

    it('should handle missing resource gracefully', async () => {
      const data = {
        firstName: 'John',
        email: 'john@example.com',
        resourceSlug: 'non-existent-resource',
      };

      mockRequest = createMockRequest(data);
      const response = await POST(mockRequest);
      const result = await response.json();

      // Should return error for non-existent resource
      expect(result.success).toBe(false);
    });
  });
});
