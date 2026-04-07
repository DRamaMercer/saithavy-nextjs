/**
 * Security Headers Tests
 * Tests for CSP building, header application, and secure response creation
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  applySecurityHeaders,
  createSecureResponse,
  securityHeadersMiddleware,
  defaultSecurityHeaders,
  developmentSecurityHeaders,
  type SecurityHeaderConfig,
} from '@/lib/security-headers';

function createMockNextRequest(): NextRequest {
  return {} as unknown as NextRequest;
}

describe('Security Headers', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    vi.stubEnv('NODE_ENV', originalEnv);
  });

  describe('applySecurityHeaders', () => {
    it('should apply Content-Security-Policy header', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      const csp = result.headers.get('Content-Security-Policy');
      expect(csp).not.toBeNull();
      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("frame-src 'none'");
      expect(csp).toContain("object-src 'none'");
    });

    it('should apply X-Frame-Options header', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      expect(result.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('should apply X-Content-Type-Options header', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      expect(result.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('should apply Referrer-Policy header', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      expect(result.headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    });

    it('should apply Permissions-Policy header', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      const permissionsPolicy = result.headers.get('Permissions-Policy');
      expect(permissionsPolicy).not.toBeNull();
      expect(permissionsPolicy).toContain("camera='none'");
      expect(permissionsPolicy).toContain("microphone='none'");
    });

    it('should apply Cross-Origin headers', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      expect(result.headers.get('Cross-Origin-Opener-Policy')).toBe('same-origin');
      expect(result.headers.get('Cross-Origin-Resource-Policy')).toBe('same-origin');
      expect(result.headers.get('Cross-Origin-Embedder-Policy')).toBe('require-corp');
    });

    it('should apply HSTS header in production', () => {
      vi.stubEnv('NODE_ENV', 'production');
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      const hsts = result.headers.get('Strict-Transport-Security');
      expect(hsts).not.toBeNull();
      expect(hsts).toContain('max-age=31536000');
      expect(hsts).toContain('includeSubDomains');
      expect(hsts).toContain('preload');
    });

    it('should NOT apply HSTS header in development', () => {
      vi.stubEnv('NODE_ENV', 'development');
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      expect(result.headers.get('Strict-Transport-Security')).toBeNull();
    });

    it('should handle empty CSP config', () => {
      const response = new NextResponse(null);
      const config: SecurityHeaderConfig = {
        contentSecurityPolicy: undefined,
        xFrameOptions: 'DENY',
      };
      const result = applySecurityHeaders(response, config);

      expect(result.headers.get('Content-Security-Policy')).toBeNull();
      expect(result.headers.get('X-Frame-Options')).toBe('DENY');
    });

    it('should include upgrade-insecure-requests in CSP when enabled', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, defaultSecurityHeaders);

      const csp = result.headers.get('Content-Security-Policy');
      expect(csp).toContain('upgrade-insecure-requests');
    });

    it('should handle minimal config without crashing', () => {
      const response = new NextResponse(null);
      const config: SecurityHeaderConfig = {};
      const result = applySecurityHeaders(response, config);

      // Should not crash, just not set any headers
      expect(result.headers.get('X-Frame-Options')).toBeNull();
    });
  });

  describe('createSecureResponse', () => {
    it('should create a JSON response with security headers', async () => {
      const data = { message: 'ok' };
      const response = createSecureResponse(data);

      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    });

    it('should create response with custom status', () => {
      const response = createSecureResponse({ error: 'not found' }, { status: 404 });

      expect(response.status).toBe(404);
    });

    it('should accept custom config', () => {
      const customConfig: SecurityHeaderConfig = {
        xFrameOptions: 'SAMEORIGIN',
      };
      const response = createSecureResponse({}, undefined, customConfig);

      expect(response.headers.get('X-Frame-Options')).toBe('SAMEORIGIN');
    });
  });

  describe('securityHeadersMiddleware', () => {
    it('should return a response with security headers', () => {
      const request = createMockNextRequest();
      const result = securityHeadersMiddleware(request);

      expect(result.headers.get('X-Frame-Options')).toBeDefined();
    });
  });

  describe('CSP directive building', () => {
    it('should include all configured directives', () => {
      const response = new NextResponse(null);
      const config: SecurityHeaderConfig = {
        contentSecurityPolicy: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          fontSrc: ["'self'"],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
        },
      };
      const result = applySecurityHeaders(response, config);
      const csp = result.headers.get('Content-Security-Policy')!;

      expect(csp).toContain("default-src 'self'");
      expect(csp).toContain("script-src 'self' 'unsafe-inline'");
      expect(csp).toContain("style-src 'self'");
      expect(csp).toContain("img-src 'self' data: https:");
      expect(csp).toContain("font-src 'self'");
      expect(csp).toContain("connect-src 'self'");
      expect(csp).toContain("frame-src 'none'");
      expect(csp).toContain("object-src 'none'");
      expect(csp).toContain("base-uri 'self'");
      expect(csp).toContain("form-action 'self'");
      expect(csp).toContain("frame-ancestors 'none'");
    });
  });

  describe('Development vs Production headers', () => {
    it('development config should include localhost in connect-src', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, developmentSecurityHeaders);
      const csp = result.headers.get('Content-Security-Policy')!;

      expect(csp).toContain('http://localhost:*');
    });

    it('development config should include localhost in img-src', () => {
      const response = new NextResponse(null);
      const result = applySecurityHeaders(response, developmentSecurityHeaders);
      const csp = result.headers.get('Content-Security-Policy')!;

      expect(csp).toContain('http://localhost:*');
    });
  });
});
