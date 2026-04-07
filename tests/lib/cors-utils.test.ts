/**
 * CORS Utilities Tests
 * Tests for CORS origin validation, header application, and preflight handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isOriginAllowed,
  applyCORSHeaders,
  createCORSResponse,
  handleCORSPreflight,
  corsMiddleware,
  validateOrigin,
  getCORSConfig,
  developmentCORSConfig,
  productionCORSConfig,
  type CORSConfig,
} from '@/lib/cors-utils';

const testConfig: CORSConfig = {
  allowedOrigins: ['https://example.com', 'https://app.example.com'],
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Request-Id'],
  allowCredentials: true,
  maxAge: 3600,
};

function createMockRequest(method: string, origin?: string | null): NextRequest {
  const headers = new Headers();
  if (origin !== undefined && origin !== null) {
    headers.set('origin', origin);
  }
  return {
    method,
    headers,
  } as unknown as NextRequest;
}

describe('CORS Utilities', () => {
  describe('isOriginAllowed', () => {
    it('should allow requests with no origin (same-origin)', () => {
      expect(isOriginAllowed(null, testConfig)).toBe(true);
    });

    it('should allow listed origins', () => {
      expect(isOriginAllowed('https://example.com', testConfig)).toBe(true);
      expect(isOriginAllowed('https://app.example.com', testConfig)).toBe(true);
    });

    it('should reject unlisted origins', () => {
      expect(isOriginAllowed('https://evil.com', testConfig)).toBe(false);
      expect(isOriginAllowed('http://example.com', testConfig)).toBe(false);
    });

    it('should match wildcard literal in allowedOrigins', () => {
      const wildcardConfig: CORSConfig = { allowedOrigins: ['*'] };
      // isOriginAllowed uses Array.includes, so '*' must be passed as origin
      expect(isOriginAllowed('*', wildcardConfig)).toBe(true);
      expect(isOriginAllowed('https://any-site.com', wildcardConfig)).toBe(false);
    });
  });

  describe('applyCORSHeaders', () => {
    it('should apply all CORS headers for allowed origin', () => {
      const response = new NextResponse(null);
      const result = applyCORSHeaders(response, 'https://example.com', testConfig);

      expect(result.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
      expect(result.headers.get('Access-Control-Allow-Methods')).toBe('GET, POST, OPTIONS');
      expect(result.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type, Authorization');
      expect(result.headers.get('Access-Control-Expose-Headers')).toBe('X-Request-Id');
      expect(result.headers.get('Access-Control-Allow-Credentials')).toBe('true');
      expect(result.headers.get('Access-Control-Max-Age')).toBe('3600');
    });

    it('should not add CORS headers for disallowed origin', () => {
      const response = new NextResponse(null);
      const result = applyCORSHeaders(response, 'https://evil.com', testConfig);

      expect(result.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });

    it('should skip CORS when no origins configured', () => {
      const response = new NextResponse(null);
      const emptyConfig: CORSConfig = { allowedOrigins: [] };
      const result = applyCORSHeaders(response, 'https://example.com', emptyConfig);

      expect(result.headers.get('Access-Control-Allow-Origin')).toBeNull();
    });

    it('should return wildcard when origin is literal * and no credentials', () => {
      const response = new NextResponse(null);
      const wildcardConfig: CORSConfig = {
        allowedOrigins: ['*'],
        allowCredentials: false,
      };
      // getAccessControlAllowOrigin checks config.allowedOrigins.includes('*') and origin must also be allowed
      const result = applyCORSHeaders(response, '*', wildcardConfig);

      expect(result.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('should return exact origin when credentials enabled', () => {
      const response = new NextResponse(null);
      const result = applyCORSHeaders(response, 'https://example.com', testConfig);

      expect(result.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
    });
  });

  describe('createCORSResponse', () => {
    it('should create a JSON response with CORS headers', () => {
      const data = { message: 'ok' };
      const response = createCORSResponse(data, 'https://example.com', testConfig);

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
    });

    it('should create response with custom status', () => {
      const response = createCORSResponse(
        { error: 'not found' },
        'https://example.com',
        testConfig,
        { status: 404 },
      );

      expect(response.status).toBe(404);
    });
  });

  describe('handleCORSPreflight', () => {
    it('should return 204 with CORS headers for allowed origin', () => {
      const request = createMockRequest('OPTIONS', 'https://example.com');
      const response = handleCORSPreflight(request, testConfig);

      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://example.com');
    });

    it('should handle preflight without origin header', () => {
      const request = createMockRequest('OPTIONS');
      const response = handleCORSPreflight(request, testConfig);

      expect(response.status).toBe(204);
    });
  });

  describe('corsMiddleware', () => {
    it('should return preflight response for OPTIONS requests', () => {
      const request = createMockRequest('OPTIONS', 'https://example.com');
      const result = corsMiddleware(request, testConfig);

      expect(result).not.toBeNull();
      expect(result!.status).toBe(204);
    });

    it('should return null for non-OPTIONS requests', () => {
      const request = createMockRequest('GET', 'https://example.com');
      const result = corsMiddleware(request, testConfig);

      expect(result).toBeNull();
    });
  });

  describe('validateOrigin', () => {
    it('should return null when no origin header', () => {
      const request = createMockRequest('GET');
      const result = validateOrigin(request, testConfig);

      expect(result).toBeNull();
    });

    it('should return null for allowed origin', () => {
      const request = createMockRequest('GET', 'https://example.com');
      const result = validateOrigin(request, testConfig);

      expect(result).toBeNull();
    });

    it('should return 403 error for disallowed origin', async () => {
      const request = createMockRequest('GET', 'https://evil.com');
      const result = validateOrigin(request, testConfig);

      expect(result).not.toBeNull();
      expect(result!.status).toBe(403);
      const body = await result!.json();
      expect(body.error).toBe('Origin not allowed');
    });
  });

  describe('getCORSConfig', () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      vi.stubEnv('NODE_ENV', originalEnv);
    });

    it('should return development config in non-production', () => {
      vi.stubEnv('NODE_ENV', 'development');
      const config = getCORSConfig();
      expect(config).toEqual(developmentCORSConfig);
    });

    it('should return production config in production', () => {
      vi.stubEnv('NODE_ENV', 'production');
      const config = getCORSConfig();
      expect(config).toEqual(productionCORSConfig);
    });
  });
});
