/**
 * Edge Function Utilities
 *
 * Common utilities for Vercel Edge Functions
 */

import type { NextRequest } from "next/server";
import { edgeLogger } from "@/lib/edge-logger";

/**
 * Extract client IP address from request headers
 */
export function getClientIP(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/**
 * Generate cache key for edge caching
 */
export function generateCacheKey(
  request: NextRequest,
  suffix?: string,
): string {
  const url = new URL(request.url);
  const baseKey = `${url.pathname}${url.search}`;
  return suffix ? `${baseKey}:${suffix}` : baseKey;
}

/**
 * Create CORS response with appropriate headers
 */
export function createCorsResponse(
  data: unknown,
  origins: string[] = ["*"],
  methods: string[] = ["GET", "POST", "OPTIONS"],
): Response {
  const response = Response.json(data);

  response.headers.set("Access-Control-Allow-Origin", origins.join(", "));
  response.headers.set("Access-Control-Allow-Methods", methods.join(", "));
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return response;
}

/**
 * Validate geo-restrictions for content
 */
export function validateGeoRestrictions(
  request: NextRequest,
  restrictedCountries: string[] = [],
): { allowed: boolean; country: string | null } {
  // In Next.js 16, geo data is passed via headers by Vercel
  const country = request.headers.get("x-vercel-ip-country") || null;

  if (!country || restrictedCountries.length === 0) {
    return { allowed: true, country };
  }

  return {
    allowed: !restrictedCountries.includes(country),
    country,
  };
}

/**
 * Format date based on locale
 */
export function formatDate(
  date: Date,
  format: string,
  locale: string = "en-US",
): string {
  try {
    if (format === "ISO") {
      return date.toISOString();
    }

    if (format === "US") {
      return date.toLocaleDateString("en-US");
    }

    // Custom formats
    const formats: Record<string, string> = {
      "MM/DD/YYYY": date.toLocaleDateString("en-US"),
      "DD/MM/YYYY": date.toLocaleDateString("en-GB"),
      "DD.MM.YYYY": date.toLocaleDateString("de-DE"),
      "YYYY-MM-DD": date.toISOString().split("T")[0],
    };

    return formats[format] || date.toLocaleDateString(locale);
  } catch (_error) {
    edgeLogger.error("[formatDate] Error", { format, locale });
    return date.toISOString();
  }
}

/**
 * Generate cache control header value
 */
export function getCacheControlHeader(
  maxAge: number,
  staleWhileRevalidate?: number,
): string {
  if (staleWhileRevalidate) {
    return `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`;
  }
  return `public, max-age=${maxAge}`;
}

/**
 * Create error response with context
 */
export function createErrorResponse(
  error: unknown,
  request: NextRequest,
  status: number = 500,
): Response {
  edgeLogger.error(
    "[EdgeFunction] Error",
    { url: request.url, method: request.method },
    error as Error,
  );

  const errorContext = {
    url: request.url,
    method: request.method,
    country: request.headers.get("x-vercel-ip-country"),
    region: request.headers.get("x-vercel-ip-region"),
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.message : "Unknown error",
  };

  return Response.json(
    {
      error: "An error occurred",
      requestId: crypto.randomUUID(),
      context: errorContext,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Error-Context": JSON.stringify(errorContext),
      },
    },
  );
}

/**
 * Validate request body against schema
 */
export function validateRequestBody<T>(
  body: unknown,
  requiredFields: (keyof T)[],
) {
  const errors: string[] = [];

  if (typeof body !== "object" || body === null) {
    return { valid: false, errors: ["Request body must be an object"] };
  }

  for (const field of requiredFields) {
    if (!(field in body)) {
      errors.push(`Missing required field: ${String(field)}`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: body as T };
}

/**
 * Transform response with geo context
 */
export function addGeoContext<T>(
  data: T,
  request: NextRequest,
): T & { _geo: GeoContext } {
  return {
    ...data,
    _geo: {
      country: request.headers.get("x-vercel-ip-country") || "unknown",
      region: request.headers.get("x-vercel-ip-region") || "unknown",
      city: request.headers.get("x-vercel-ip-city") || "unknown",
      timestamp: new Date().toISOString(),
    },
  };
}

/**
 * Geo context interface
 */
interface GeoContext {
  country: string;
  region: string;
  city: string;
  timestamp: string;
}

/**
 * Performance monitoring
 */
export function trackPerformance(
  startTime: number,
  operation: string,
  request: NextRequest,
): void {
  const duration = Date.now() - startTime;

  edgeLogger.info("[EdgePerformance]", {
    operation,
    duration: `${duration}ms`,
    url: request.url,
    country: request.headers.get("x-vercel-ip-country"),
    region: request.headers.get("x-vercel-ip-region"),
  });

  // In production, send to monitoring service
  // await sendToMonitoring({ operation, duration, url: request.url });
}

/**
 * Generate request ID for tracing
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Edge function configuration interface
 */
export interface EdgeFunctionConfig {
  cacheTime: number;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  geo?: {
    enabled: boolean;
    restrictedCountries?: string[];
  };
  security?: {
    corsOrigins: string[];
    requireAuth?: boolean;
  };
}

/**
 * Default configuration for edge functions
 */
export const defaultConfig: EdgeFunctionConfig = {
  cacheTime: 300, // 5 minutes
  rateLimit: {
    requests: 100,
    windowMs: 60000, // 1 minute
  },
  geo: {
    enabled: true,
  },
  security: {
    corsOrigins: ["*"],
    requireAuth: false,
  },
};
