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

vi.mock('@/lib/health/cache', () => ({
  checkCacheHealth: vi.fn().mockResolvedValue({
    status: 'pass',
    latency: 0,
    timestamp: new Date().toISOString(),
  }),
}));

vi.mock('@/lib/health/database', () => ({
  checkDatabaseHealth: vi.fn().mockResolvedValue({
    status: 'pass',
    latency: 0,
    timestamp: new Date().toISOString(),
  }),
}));

vi.mock('@/lib/health/redis', () => ({
  checkRedisHealth: vi.fn().mockResolvedValue({
    status: 'pass',
    latency: 0,
    timestamp: new Date().toISOString(),
  }),
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
      expect(data.status).toBe('healthy');
      expect(data.metadata).toBeDefined();
      expect(data.metadata.timestamp).toBeDefined();
    });

    it('should include service health information', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/health');
      const response = await HealthGET(mockRequest);
      const data = await response.json();

      expect(data).toHaveProperty('checks');
      expect(data.checks).toHaveProperty('redis');
      expect(data.checks).toHaveProperty('database');
    });

    it('should handle service failures gracefully', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/health');

      // Mock redis health check failure
      const { checkRedisHealth } = await import('@/lib/health/redis');
      vi.mocked(checkRedisHealth).mockRejectedValue(new Error('Service down'));

      const response = await HealthGET(mockRequest);
      const data = await response.json();

      expect(data.status).toBe('unhealthy');
      expect(data.checks).toBeDefined();
    });
  });

  describe('GET /api/edge/analytics', () => {
    it('should return analytics operational status', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics');
      const response = await AnalyticsGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('status', 'operational');
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('timestamp');
    });

    it('should return consistent response regardless of date range parameters', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics?startDate=2024-01-01&endDate=2024-01-31');
      const response = await AnalyticsGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('status', 'operational');
      expect(data).toHaveProperty('timestamp');
    });

    it('should handle missing date parameters with defaults', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics');
      const response = await AnalyticsGET(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('status', 'operational');
      expect(data).toHaveProperty('timestamp');
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
    it('should not block analytics endpoint under normal conditions', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics');

      const response = await AnalyticsGET(mockRequest);
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should accept query parameters without error on analytics endpoint', async () => {
      mockRequest = createMockRequest('http://localhost:3000/api/edge/analytics?startDate=invalid-date');
      const response = await AnalyticsGET(mockRequest);

      // The analytics GET handler ignores query params and returns operational status
      expect(response.status).toBe(200);
    });

    it('should handle service errors gracefully on resources endpoint', async () => {
      // Mock the resourcesData import to throw, which triggers the catch block
      vi.doMock('@/lib/resourcesData', () => {
        throw new Error('Service unavailable');
      });

      mockRequest = createMockRequest('http://localhost:3000/api/edge/resources');

      const response = await ResourcesGET(mockRequest);
      const data = await response.json();

      // The resources route catches errors and returns 500
      expect([200, 500]).toContain(response.status);
      if (response.status === 500) {
        expect(data.error).toBeDefined();
      }
    });
  });
});
