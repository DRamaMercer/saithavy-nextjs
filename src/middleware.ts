/**
 * Next.js Middleware
 * Runs on every request to apply security headers and CORS
 */

import { NextRequest, NextResponse } from "next/server";
import { securityHeadersMiddleware } from "@/lib/security-headers";
import { corsMiddleware, validateOrigin } from "@/lib/cors-utils";

/**
 * Maximum request body size (1MB)
 * Prevents DoS attacks through large payloads
 */
const MAX_REQUEST_SIZE = 1024 * 1024; // 1MB in bytes

/**
 * Paths that require authentication
 */
const PROTECTED_PATHS = ["/api/admin", "/api/protected"];

/**
 * Paths that skip middleware
 */
const SKIP_PATHS = ["/_next", "/static", "/favicon.ico", "/public"];

/**
 * Main middleware function
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and Next.js internals
  if (
    SKIP_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/api/edge") // Edge functions handle their own CORS
  ) {
    return NextResponse.next();
  }

  // Validate request size (if Content-Length header is present)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_REQUEST_SIZE) {
    return NextResponse.json(
      {
        error: "Request too large",
        message: `Maximum request size is ${MAX_REQUEST_SIZE / 1024 / 1024}MB`,
      },
      { status: 413 },
    );
  }

  // Check authentication for protected paths
  if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "API key required for this endpoint",
        },
        { status: 401 },
      );
    }

    // Note: Actual API key validation happens in the route handler
    // This is just a quick check to reject obviously invalid requests
  }

  // Validate CORS origin
  const corsError = validateOrigin(request);
  if (corsError) {
    return corsError;
  }

  // Handle CORS preflight
  const corsPreflight = corsMiddleware(request);
  if (corsPreflight) {
    return corsPreflight;
  }

  // Apply security headers to all responses
  return securityHeadersMiddleware(request);
}

/**
 * Configure which paths the middleware runs on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
