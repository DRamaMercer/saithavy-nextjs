/**
 * Analytics Library
 * Handles event tracking for Google Analytics, Facebook Pixel, and GTM
 *
 * Client-side only - uses browser APIs and client logger
 */

"use client";

import { clientLogger } from "@/lib/client-logger";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

type EventName = string;
type EventParams = Record<string, unknown>;

export const trackEvent = (event: EventName, params?: EventParams): void => {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (window.gtag) {
    window.gtag("event", event, params);
  }

  // Facebook Pixel
  if (window.fbq) {
    window.fbq("trackCustom", event, params);
  }

  // Push to dataLayer for GTM
  if (window.dataLayer) {
    window.dataLayer.push({ event, ...params });
  }

  // Console log for development
  if (process.env.NODE_ENV === "development") {
    clientLogger.info("[Analytics]", { event, params });
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  trackEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

export const trackResourceDownload = (
  resourceId: string,
  resourceTitle: string,
  format: "pdf" | "web" | "print",
): void => {
  trackEvent("resource_download", {
    resource_id: resourceId,
    resource_title: resourceTitle,
    download_format: format,
  });
};

export const trackEmailSignup = (source: string, resourceId?: string): void => {
  trackEvent("email_signup", {
    signup_source: source,
    resource_id: resourceId,
  });
};

export const trackResourceView = (
  resourceId: string,
  resourceTitle: string,
  category: string,
): void => {
  trackEvent("resource_view", {
    resource_id: resourceId,
    resource_title: resourceTitle,
    resource_category: category,
  });
};

export const trackCtaClick = (ctaName: string, ctaLocation: string): void => {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
};

export const trackSearch = (searchTerm: string, resultCount: number): void => {
  trackEvent("search", {
    search_term: searchTerm,
    result_count: resultCount,
  });
};

export const initAnalytics = (): void => {
  if (typeof window === "undefined") return;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // GTM snippet would go here
  // For now, this is a placeholder for adding Google Tag Manager
};

// Named export for better tree-shaking
export const analytics = {
  trackEvent,
  trackPageView,
  trackResourceDownload,
  trackEmailSignup,
  trackResourceView,
  trackCtaClick,
  trackSearch,
  initAnalytics,
};

// Default export for convenience
export default analytics;
