/**
 * Edge Functions API Tests
 * Tests for edge function endpoints (health, analytics, geo-lookup, etc.)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as HealthGET } from '@/app/api/edge/health/route';
import { GET as AnalyticsGET } from '@/app/api/edge/analytics/route';
import { GET as ResourcesGET } from '@/app/api/edge/resources/route';
import { NextRequest } from 'next/server';

// Mock dependencies at top level
vi.mock('@/lib/edge-logger', () => ({
  logAction: vi.fn(),
  logError: vi.fn(),
}));

vi.mock('@/lib/di/types', () => ({
  getService: vi.fn(() => ({
    checkHealth: vi.fn().mockResolvedValue({ status: 'healthy' }),
    getMetrics: vi.fn().mockResolvedValue({
      totalViews: 1000,
      uniqueVisitors: 500,
      topPages: ['/resources', '/about'],
    }),
  })),
}));

describe('Edge Functions API', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockRequest = (url: string): NextRequest => {
    return {
      headers: new Headers(),
      url,
      nextUrl: new URL(url, 'http://localhost:3000'),
    } as NextRequest;
  };

  describe('GET /api/edge/health', () => {
    it('should return health status', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/health');
      const response = await HealthGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('ok');
      expect(data.timestamp).toBeDefined();
    });

    it('should include service health information', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/health');
      const response = await HealthGET(mockRequest);
      const data = await response.json();

      expect(data).toHaveProperty('services');
      expect(data.services).toHaveProperty('redis');
      expect(data.services).toHaveProperty('database');
    });

    it('should handle service failures gracefully', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/health');

      // Mock service failure
      const { getService } = await import('@/lib/di/types');
      vi.mocked(getService).mockReturnValue({
        checkHealth: vi.fn().mockRejectedValue(new Error('Service down')),
      } as any);

      const response = await HealthGET(mockRequest);
      const data = await response.json();

      expect(data.status).toBe('degraded');
      expect(data.services).toBeDefined();
    });
  });

  describe('GET /api/edge/analytics', () => {
    it('should return analytics data', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics');
      const response = await AnalyticsGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('pageViews');
      expect(data).toHaveProperty('uniqueVisitors');
    });

    it('should support date range filtering', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics?startDate=2024-01-01&endDate=2024-01-31');
      const response = await AnalyticsGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('period');
    });

    it('should handle missing date parameters with defaults', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics');
      const response = await AnalyticsGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('period');
    });
  });

  describe('GET /api/edge/resources', () => {
    it('should return resources list', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/resources');
      const response = await ResourcesGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.resources)).toBe(true);
    });

    it('should support category filtering', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/resources?category=mindful-leadership');
      const response = await ResourcesGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.resources)).toBe(true);
    });

    it('should support featured filter', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/resources?featured=true');
      const response = await ResourcesGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data.resources)).toBe(true);
    });

    it('should cache responses', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/resources');
      const response = await ResourcesGET(mockRequest);

      expect(response.headers.get('cache-control')).toContain('public');
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limits to analytics endpoint', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics');

      // Mock rate limit exceeded
      const { getService } = await import('@/lib/di/types');
      vi.mocked(getService).mockReturnValue({
        checkLimit: vi.fn().mockResolvedValue({ success: false, limit: 100, remaining: 0, reset: Date.now() + 3600000 }),
      } as any);

      const response = await AnalyticsGET(mockRequest);
      expect(response.status).toBe(429);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed query parameters', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics?startDate=invalid-date');
      const response = await AnalyticsGET(mockRequest);

      expect(response.status).toBe(400);
    });

    it('should handle service unavailability', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/resources');

      const { getService } = await import('@/lib/di/types');
      vi.mocked(getService).mockImplementation(() => {
        throw new Error('Service unavailable');
      });

      const response = await ResourcesGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBeDefined();
    });
  });
});
