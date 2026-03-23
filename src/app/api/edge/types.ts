/**
 * Edge Function Types
 *
 * Type definitions for Vercel Edge Functions
 */

/**
 * Geolocation data from Vercel Edge
 */
export interface EdgeGeo {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Analytics event payload
 */
export interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, string | number | boolean>;
  timestamp: string;
  url: string;
  userAgent: string;
  geo: {
    country?: string;
    region?: string;
    city?: string;
  };
  ip: string;
}

/**
 * Localized content configuration
 */
export interface LocalizedContent {
  currency: string;
  language: string;
  dateFormat: string;
  pricingMultiplier: number;
  message: string;
}

/**
 * Content configuration by country
 */
export type ContentConfig = Record<string, LocalizedContent>;

/**
 * Proxy configuration
 */
export interface ProxyConfig {
  targetUrl: string;
  cacheTime: number;
  headers?: Record<string, string>;
  transformResponse?: (data: unknown, request: Request) => unknown;
}

/**
 * Proxy configurations by type
 */
export type ProxyConfigs = Record<string, ProxyConfig>;

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, boolean | string>;
  metadata?: {
    region?: string;
    country?: string;
    responseTime?: string;
    timestamp: string;
  };
}

/**
 * Resource availability response
 */
export interface ResourceAvailabilityResponse {
  country: string;
  region: string;
  total: number;
  restricted: number;
  resources: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    type: string;
    difficulty?: string;
    timeToRead?: string;
    featured: boolean;
    downloads: number;
  }>;
  timestamp: string;
}

/**
 * Geo content response
 */
export interface GeoContentResponse {
  country: string;
  city?: string;
  region: string;
  currency: string;
  language: string;
  dateFormat: string;
  pricingMultiplier: number;
  message: string;
  availableCountries: string[];
  timestamp: string;
}

/**
 * Geo lookup response
 */
export interface GeoLookupResponse {
  ip: string;
  geo: EdgeGeo;
  timestamp: string;
}

/**
 * Error response with context
 */
export interface ErrorResponse {
  error: string;
  requestId?: string;
  context?: {
    url?: string;
    method?: string;
    country?: string | null;
    region?: string | null;
    timestamp?: string;
    error?: string;
  };
}

/**
 * Edge function metadata
 */
export interface EdgeMetadata {
  region: string;
  country: string;
  timestamp: string;
  ip?: string;
}
