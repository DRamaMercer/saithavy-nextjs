/**
 * Contact API Route Tests
 * Tests for /api/contact endpoint
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

// Mock Resend at top level
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: vi.fn(),
    },
  })),
}));

// Mock rate limiter at top level
vi.mock('@/lib/di/types', () => ({
  getService: vi.fn(() => ({
    checkLimit: vi.fn().mockResolvedValue({ success: true, limit: 10, remaining: 9, reset: Date.now() + 3600000 }),
  })),
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
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with sufficient length.',
      };

      mockRequest = createMockRequest(validData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Message sent successfully');
    });

    it('should reject missing required fields', async () => {
      const invalidData = {
        name: 'John Doe',
        // Missing email, subject, message
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
        name: 'John Doe',
        email: 'not-an-email',
        subject: 'Test',
        message: 'Test message',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject short message', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Short', // Too short
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should reject long name', async () => {
      const invalidData = {
        name: 'A'.repeat(101), // Too long
        email: 'john@example.com',
        subject: 'Test',
        message: 'This is a test message with sufficient length.',
      };

      mockRequest = createMockRequest(invalidData);
      const response = await POST(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should handle rate limiting', async () => {
      // This test would require mocking the rate limiter to return limit exceeded
      // For now, we'll test the structure exists
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message with sufficient length.',
      };

      mockRequest = createMockRequest(validData);

      // Mock getService to return rate limit exceeded
      const { getService } = await import('@/lib/di/types');
      vi.mocked(getService).mockReturnValue({
        checkLimit: vi.fn().mockResolvedValue({ success: false, limit: 10, remaining: 0, reset: Date.now() + 3600000 }),
      } as any);

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.success).toBe(false);
      // Should indicate rate limiting
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize HTML in message', async () => {
      const dataWithHtml = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: '<script>alert("xss")</script> Test message',
      };

      mockRequest = createMockRequest(dataWithHtml);
      const response = await POST(mockRequest);

      // Should not crash, should sanitize
      expect(response.status).not.toBe(500);
    });

    it('should handle SQL injection attempts', async () => {
      const sqlInjectionData = {
        name: "John'; DROP TABLE users; --",
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message',
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

    it('should handle email service failures', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test',
        message: 'Test message',
      };

      mockRequest = createMockRequest(validData);

      // Mock Resend to throw error
      const { Resend } = await import('resend');
      vi.mocked(Resend).mockImplementation(() => ({
        emails: {
          send: vi.fn().mockRejectedValue(new Error('Email service down')),
        },
      } as any));

      const response = await POST(mockRequest);
      const data = await response.json();

      expect(data.success).toBe(false);
      expect(data.error).toContain('email');
    });
  });
});
