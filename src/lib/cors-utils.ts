/**
 * CORS (Cross-Origin Resource Sharing) Utilities
 * Provides secure CORS handling for API endpoints
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * CORS configuration options
 */
export interface CORSConfig {
  /**
   * List of allowed origins
   * Use specific domains, NOT "*" for production
   * Examples: ["https://example.com", "https://www.example.com"]
   */
  allowedOrigins: string[];

  /**
   * Allowed HTTP methods
   */
  allowedMethods?: string[];

  /**
   * Allowed request headers
   */
  allowedHeaders?: string[];

  /**
   * Headers exposed to browser
   */
  exposedHeaders?: string[];

  /**
   * Allow credentials (cookies, authorization headers)
   * WARNING: Cannot be used with allowedOrigins: ["*"]
   */
  allowCredentials?: boolean;

  /**
   * Preflight cache duration in seconds
   */
  maxAge?: number;
}

/**
 * Default CORS configuration for development
 */
export const developmentCORSConfig: CORSConfig = {
  allowedOrigins: ["http://localhost:3000", "http://localhost:3001"],
  allowedMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
  allowCredentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Default CORS configuration for production
 * Customize this with your actual domains
 */
export const productionCORSConfig: CORSConfig = {
  allowedOrigins: [
    // Add your production domains here
    // "https://yourdomain.com",
    // "https://www.yourdomain.com",
  ],
  allowedMethods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  exposedHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
  allowCredentials: false,
  maxAge: 86400,
};

/**
 * Get appropriate CORS config based on environment
 */
export function getCORSConfig(): CORSConfig {
  return process.env.NODE_ENV === "production" ? productionCORSConfig : developmentCORSConfig;
}

/**
 * Validate if origin is allowed
 */
export function isOriginAllowed(origin: string | null, config: CORSConfig): boolean {
  // No origin check for same-origin requests
  if (!origin) return true;

  // Check if origin is in allowlist
  return config.allowedOrigins.includes(origin);
}

/**
 * Get the appropriate Origin header value for CORS response
 */
function getAccessControlAllowOrigin(origin: string | null, config: CORSConfig): string {
  // If credentials are allowed, must return exact origin
  if (config.allowCredentials) {
    if (origin && isOriginAllowed(origin, config)) {
      return origin;
    }
    // If origin not allowed, return first allowed origin
    return config.allowedOrigins[0] || "";
  }

  // If credentials not allowed, can use wildcard or specific origin
  if (config.allowedOrigins.includes("*")) {
    return "*";
  }

  if (origin && isOriginAllowed(origin, config)) {
    return origin;
  }

  return config.allowedOrigins[0] || "";
}

/**
 * Apply CORS headers to a response
 */
export function applyCORSHeaders(
  response: NextResponse,
  origin: string | null,
  config: CORSConfig = getCORSConfig(),
): NextResponse {
  // If no origins configured, skip CORS headers
  if (config.allowedOrigins.length === 0) {
    return response;
  }

  // Validate origin
  if (!isOriginAllowed(origin, config)) {
    // Origin not allowed - don't add CORS headers
    // Browser will block the response
    return response;
  }

  // Apply CORS headers
  response.headers.set(
    "Access-Control-Allow-Origin",
    getAccessControlAllowOrigin(origin, config),
  );

  if (config.allowedMethods) {
    response.headers.set(
      "Access-Control-Allow-Methods",
      config.allowedMethods.join(", "),
    );
  }

  if (config.allowedHeaders) {
    response.headers.set(
      "Access-Control-Allow-Headers",
      config.allowedHeaders.join(", "),
    );
  }

  if (config.exposedHeaders) {
    response.headers.set(
      "Access-Control-Expose-Headers",
      config.exposedHeaders.join(", "),
    );
  }

  if (config.allowCredentials) {
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  if (config.maxAge) {
    response.headers.set("Access-Control-Max-Age", config.maxAge.toString());
  }

  return response;
}

/**
 * Create a CORS response
 */
export function createCORSResponse(
  data: unknown,
  origin: string | null,
  config?: CORSConfig,
  init?: ResponseInit,
): NextResponse {
  const response = NextResponse.json(data, init);
  return applyCORSHeaders(response, origin, config);
}

/**
 * Handle OPTIONS preflight request
 */
export function handleCORSPreflight(
  request: NextRequest,
  config?: CORSConfig,
): NextResponse {
  const origin = request.headers.get("origin");
  const corsConfig = config || getCORSConfig();

  const response = new NextResponse(null, { status: 204 });

  return applyCORSHeaders(response, origin, corsConfig);
}

/**
 * Middleware to handle CORS for API routes
 */
export function corsMiddleware(
  request: NextRequest,
  config?: CORSConfig,
): NextResponse | null {
  const _origin = request.headers.get("origin");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return handleCORSPreflight(request, config);
  }

  // For other requests, return null to let request proceed
  // CORS headers will be applied to the response
  return null;
}

/**
 * Validate origin and return error if not allowed
 */
export function validateOrigin(
  request: NextRequest,
  config?: CORSConfig,
): NextResponse | null {
  const origin = request.headers.get("origin");
  const corsConfig = config || getCORSConfig();

  // No origin check needed for same-origin or server-to-server requests
  if (!origin) {
    return null;
  }

  // Check if origin is allowed
  if (!isOriginAllowed(origin, corsConfig)) {
    return NextResponse.json(
      {
        error: "Origin not allowed",
        message: "The origin of this request is not permitted by CORS policy",
      },
      { status: 403 },
    );
  }

  return null;
}
