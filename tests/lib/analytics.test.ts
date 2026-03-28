/**
 * Analytics Library Tests
 * Tests for analytics tracking functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock window object
const mockGtag = vi.fn();
const mockFbq = vi.fn();

// Mock client logger at top level
vi.mock('@/lib/client-logger', () => ({
  clientLogger: {
    info: vi.fn(),
  },
}));

describe('Analytics Library', () => {
  beforeEach(() => {
    // Setup window mocks
    global.window = {
      gtag: mockGtag,
      fbq: mockFbq,
      dataLayer: [],
    } as any;

    // Mock environment
    vi.stubEnv('NODE_ENV', 'development');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should call gtag with event and params', async () => {
      const { trackEvent } = await import('@/lib/analytics');

      trackEvent('button_click', { button_id: 'submit' });

      expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', { button_id: 'submit' });
    });

    it('should call fbq with event and params', async () => {
      const { trackEvent } = await import('@/lib/analytics');

      trackEvent('form_submit', { form_id: 'contact' });

      expect(mockFbq).toHaveBeenCalledWith('trackCustom', 'form_submit', { form_id: 'contact' });
    });

    it('should push to dataLayer', async () => {
      const { trackEvent } = await import('@/lib/analytics');

      trackEvent('custom_event', { value: 42 });

      expect(window.dataLayer).toContainEqual({ event: 'custom_event', value: 42 });
    });

    it('should handle events without params', async () => {
      const { trackEvent } = await import('@/lib/analytics');

      trackEvent('simple_event');

      expect(mockGtag).toHaveBeenCalledWith('event', 'simple_event', undefined);
    });

    it('should log events in development', async () => {
      const { trackEvent } = await import('@/lib/analytics');
      const { clientLogger } = await import('@/lib/client-logger');

      trackEvent('dev_event', { test: true });

      expect(clientLogger.info).toHaveBeenCalledWith('[Analytics]', { event: 'dev_event', test: true });
    });

    it('should not log events in production', async () => {
      vi.stubEnv('NODE_ENV', 'production');
      const { trackEvent } = await import('@/lib/analytics');
      const { clientLogger } = await import('@/lib/client-logger');

      trackEvent('prod_event', { test: true });

      expect(clientLogger.info).not.toHaveBeenCalled();
    });

    it('should handle missing gtag gracefully', async () => {
      delete (window as any).gtag;
      const { trackEvent } = await import('@/lib/analytics');

      expect(() => trackEvent('test_event')).not.toThrow();
    });

    it('should handle missing fbq gracefully', async () => {
      delete (window as any).fbq;
      const { trackEvent } = await import('@/lib/analytics');

      expect(() => trackEvent('test_event')).not.toThrow();
    });

    it('should handle missing dataLayer gracefully', async () => {
      delete (window as any).dataLayer;
      const { trackEvent } = await import('@/lib/analytics');

      expect(() => trackEvent('test_event')).not.toThrow();
    });

    it('should not execute on server side', async () => {
      // Mock server-side environment
      const originalWindow = global.window;
      // @ts-ignore - testing server-side behavior
      delete global.window;

      const { trackEvent } = await import('@/lib/analytics');

      trackEvent('server_event', { test: true });

      expect(mockGtag).not.toHaveBeenCalled();

      global.window = originalWindow;
    });
  });

  describe('trackPageView', () => {
    it('should track page_view event with path', async () => {
      const { trackPageView } = await import('@/lib/analytics');

      trackPageView('/resources');

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/resources',
        page_title: undefined,
      });
    });

    it('should track page_view event with path and title', async () => {
      const { trackPageView } = await import('@/lib/analytics');

      trackPageView('/resources', 'Resources Page');

      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
        page_path: '/resources',
        page_title: 'Resources Page',
      });
    });

    it('should push to dataLayer', async () => {
      const { trackPageView } = await import('@/lib/analytics');

      trackPageView('/about', 'About Us');

      expect(window.dataLayer).toContainEqual({
        event: 'page_view',
        page_path: '/about',
        page_title: 'About Us',
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null params', async () => {
      const { trackEvent } = await import('@/lib/analytics');

      expect(() => trackEvent('test', null as any)).not.toThrow();
    });

    it('should handle undefined params', async () => {
      const { trackEvent } = await import('@/lib/analytics');

      expect(() => trackEvent('test', undefined)).not.toThrow();
    });

    it('should handle empty string event name', async () => {
      const { trackEvent } = await import('@/lib/analytics');

      expect(() => trackEvent('')).not.toThrow();
    });

    it('should handle special characters in params', async () => {
      const { trackEvent } = await import('@/lib/analytics');

      expect(() => trackEvent('test', { special: '<script>alert("xss")</script>' })).not.toThrow();
    });
  });
});
