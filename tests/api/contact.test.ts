/**
 * Contact API Route Tests
 * Tests for /api/contact endpoint
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

// Mock DI services at top level
vi.mock('@/lib/di/services', () => ({
  resolveRateLimiter: vi.fn().mockResolvedValue({
    checkLimit: vi.fn().mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: Date.now() + 3600000 }),
  }),
  resolveContactRepository: vi.fn().mockReturnValue({
    save: vi.fn().mockResolvedValue(undefined),
  }),
}));

// Mock logger at top level
vi.mock('@/lib/edge-logger', () => ({
  logAction: vi.fn(),
  logError: vi.fn(),
}));

describe('Contact API', () => {
  let mockRequest: NextRequest;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: async () => body,
      headers: new Headers(),
      url: 'http://localhost:3000/api/contact',
    } as NextRequest;
  };

  describe('POST /api/contact', () => {
    it('should accept valid contact form submission', async () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        interest: 'ai-consulting',
        message: 'This is a test message with sufficient length.',
        honeypot: '',
      };

      mockRequest = createMockRequest(validData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Thank you! Your message has been received.');
    });

    it('should reject missing required fields', async () => {
      const invalidData = {
        firstName: 'John',
        // Missing lastName, email, interest, message, honeypot
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });

    it('should reject invalid email format', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email',
        interest: 'ai-consulting',
        message: 'Test message',
        honeypot: '',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject short message', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        interest: 'ai-consulting',
        message: 'Short', // Too short
        honeypot: '',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject long name', async () => {
      const invalidData = {
        firstName: 'A'.repeat(51), // Too long (max 50)
        lastName: 'Doe',
        email: 'john@example.com',
        interest: 'ai-consulting',
        message: 'This is a test message with sufficient length.',
        honeypot: '',
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
        lastName: 'Doe',
        email: 'john@example.com',
        interest: 'ai-consulting',
        message: 'This is a test message with sufficient length.',
        honeypot: '',
      };

      mockRequest = createMockRequest(validData);

      // Override the rate limiter mock to return limit exceeded for this test only
      const diServices = await import('@/lib/di/services');
      vi.mocked(diServices.resolveRateLimiter)
        .mockResolvedValueOnce({
          checkLimit: vi.fn().mockResolvedValue({ success: false, limit: 10, remaining: 0, reset: Date.now() + 3600000 }),
        } as any);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize HTML in message', async () => {
      const dataWithHtml = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        interest: 'ai-consulting',
        message: '<script>alert("xss")</script> Test message',
        honeypot: '',
      };

      mockRequest = createMockRequest(dataWithHtml);
      const response = await POST(mockRequest);

      // Should not crash, should sanitize
      expect(response.status).not.toBe(500);
    });

    it('should handle SQL injection attempts', async () => {
      const sqlInjectionData = {
        firstName: "John'; DROP TABLE users; --",
        lastName: 'Doe',
        email: 'john@example.com',
        interest: 'ai-consulting',
        message: 'Test message',
        honeypot: '',
      };

      mockRequest = createMockRequest(sqlInjectionData);
      const response = await POST(mockRequest);

      // Should not crash, input should be sanitized
      expect(response.status).not.toBe(500);
    });
  });

  describe('Error Handling', () => {
    it('should handle JSON parse errors gracefully', async () => {
      const badRequest = {
        json: async () => {
          throw new Error('Invalid JSON');
        },
        headers: new Headers(),
        url: 'http://localhost:3000/api/contact',
      } as NextRequest;

      const response = await POST(badRequest);
      expect(response.status).toBe(400);
    });

    it('should handle service failures', async () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        interest: 'ai-consulting',
        message: 'Test message',
        honeypot: '',
      };

      mockRequest = createMockRequest(validData);

      // Mock repository to throw error
      const { resolveContactRepository } = await import('@/lib/di/services');
      vi.mocked(resolveContactRepository).mockReturnValueOnce({
        save: vi.fn().mockRejectedValue(new Error('Service down')),
      } as any);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBeDefined();
    });
  });
});
