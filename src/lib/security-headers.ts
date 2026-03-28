/**
 * Security Headers Configuration
 * Provides security headers for Next.js applications
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Security header configuration
 */
export interface SecurityHeaderConfig {
  /**
   * Content Security Policy
   * Controls resources the user agent is allowed to load
   */
  contentSecurityPolicy?: {
    defaultSrc?: string[];
    scriptSrc?: string[];
    styleSrc?: string[];
    imgSrc?: string[];
    fontSrc?: string[];
    connectSrc?: string[];
    frameSrc?: string[];
    objectSrc?: string[];
    baseUri?: string[];
    formAction?: string[];
    frameAncestors?: string[];
    upgradeInsecureRequests?: boolean;
  };

  /**
   * Strict-Transport-Security
   * Enforces HTTPS connections
   */
  strictTransportSecurity?: {
    maxAge: number; // in seconds
    includeSubDomains?: boolean;
    preload?: boolean;
  };

  /**
   * X-Frame-Options
   * Prevents clickjacking attacks
   */
  xFrameOptions?: "DENY" | "SAMEORIGIN" | `ALLOW-FROM ${string}`;

  /**
   * X-Content-Type-Options
   * Prevents MIME-sniffing
   */
  xContentTypeOptions?: "nosniff";

  /**
   * Referrer-Policy
   * Controls how much referrer information is sent
   */
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";

  /**
   * Permissions-Policy
   * Controls browser features and APIs
   */
  permissionsPolicy?: {
    camera?: string[];
    microphone?: string[];
    geolocation?: string[];
    interestCohort?: string[];
  };

  /**
   * Cross-Origin-Opener-Policy
   * Controls cross-origin window access
   */
  crossOriginOpenerPolicy?: "unsafe-none" | "same-origin" | "same-origin-allow-popups";

  /**
   * Cross-Origin-Resource-Policy
   * Controls cross-origin resource access
   */
  crossOriginResourcePolicy?: "same-site" | "same-origin" | "cross-origin";

  /**
   * Cross-Origin-Embedder-Policy
   * Controls cross-origin resource embedding
   */
  crossOriginEmbedderPolicy?: "unsafe-none" | "require-corp";
}

/**
 * Default security headers configuration for production
 */
export const defaultSecurityHeaders: SecurityHeaderConfig = {
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:", "blob:"],
    fontSrc: ["'self'", "data:"],
    connectSrc: ["'self'"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: true,
  },
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: {
    camera: ["'none'"],
    microphone: ["'none'"],
    geolocation: ["'self'"],
    interestCohort: ["'none'"],
  },
  crossOriginOpenerPolicy: "same-origin",
  crossOriginResourcePolicy: "same-origin",
  crossOriginEmbedderPolicy: "require-corp",
};

/**
 * Development security headers (more relaxed for local development)
 */
export const developmentSecurityHeaders: SecurityHeaderConfig = {
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:", "blob:", "http://localhost:*"],
    fontSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "http://localhost:*", "ws://localhost:*", "ws://localhost:*"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"],
    frameAncestors: ["'none'"],
  },
  xFrameOptions: "DENY",
  xContentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: {
    camera: ["'none'"],
    microphone: ["'none'"],
    geolocation: ["'self'"],
    interestCohort: ["'none'"],
  },
};

/**
 * Build Content-Security-Policy header value
 */
function buildCSP(config: SecurityHeaderConfig["contentSecurityPolicy"]): string {
  if (!config) return "";

  const directives: string[] = [];

  if (config.defaultSrc) directives.push(`default-src ${config.defaultSrc.join(" ")}`);
  if (config.scriptSrc) directives.push(`script-src ${config.scriptSrc.join(" ")}`);
  if (config.styleSrc) directives.push(`style-src ${config.styleSrc.join(" ")}`);
  if (config.imgSrc) directives.push(`img-src ${config.imgSrc.join(" ")}`);
  if (config.fontSrc) directives.push(`font-src ${config.fontSrc.join(" ")}`);
  if (config.connectSrc) directives.push(`connect-src ${config.connectSrc.join(" ")}`);
  if (config.frameSrc) directives.push(`frame-src ${config.frameSrc.join(" ")}`);
  if (config.objectSrc) directives.push(`object-src ${config.objectSrc.join(" ")}`);
  if (config.baseUri) directives.push(`base-uri ${config.baseUri.join(" ")}`);
  if (config.formAction) directives.push(`form-action ${config.formAction.join(" ")}`);
  if (config.frameAncestors) directives.push(`frame-ancestors ${config.frameAncestors.join(" ")}`);
  if (config.upgradeInsecureRequests) directives.push("upgrade-insecure-requests");

  return directives.join("; ");
}

/**
 * Apply security headers to a NextResponse
 */
export function applySecurityHeaders(
  response: NextResponse,
  config: SecurityHeaderConfig = defaultSecurityHeaders,
): NextResponse {
  // Content-Security-Policy
  if (config.contentSecurityPolicy) {
    const csp = buildCSP(config.contentSecurityPolicy);
    if (csp) {
      response.headers.set("Content-Security-Policy", csp);
    }
  }

  // Strict-Transport-Security (only in production with HTTPS)
  if (config.strictTransportSecurity && process.env.NODE_ENV === "production") {
    const sts = `max-age=${config.strictTransportSecurity.maxAge}${
      config.strictTransportSecurity.includeSubDomains ? "; includeSubDomains" : ""
    }${config.strictTransportSecurity.preload ? "; preload" : ""}`;
    response.headers.set("Strict-Transport-Security", sts);
  }

  // X-Frame-Options
  if (config.xFrameOptions) {
    response.headers.set("X-Frame-Options", config.xFrameOptions);
  }

  // X-Content-Type-Options
  if (config.xContentTypeOptions) {
    response.headers.set("X-Content-Type-Options", config.xContentTypeOptions);
  }

  // Referrer-Policy
  if (config.referrerPolicy) {
    response.headers.set("Referrer-Policy", config.referrerPolicy);
  }

  // Permissions-Policy
  if (config.permissionsPolicy) {
    const policies: string[] = [];
    if (config.permissionsPolicy.camera) policies.push(`camera=${config.permissionsPolicy.camera.join(", ")}`);
    if (config.permissionsPolicy.microphone) policies.push(`microphone=${config.permissionsPolicy.microphone.join(", ")}`);
    if (config.permissionsPolicy.geolocation) policies.push(`geolocation=${config.permissionsPolicy.geolocation.join(", ")}`);
    if (config.permissionsPolicy.interestCohort) policies.push(`interest-cohort=${config.permissionsPolicy.interestCohort.join(", ")}`);

    if (policies.length > 0) {
      response.headers.set("Permissions-Policy", policies.join(", "));
    }
  }

  // Cross-Origin-Opener-Policy
  if (config.crossOriginOpenerPolicy) {
    response.headers.set("Cross-Origin-Opener-Policy", config.crossOriginOpenerPolicy);
  }

  // Cross-Origin-Resource-Policy
  if (config.crossOriginResourcePolicy) {
    response.headers.set("Cross-Origin-Resource-Policy", config.crossOriginResourcePolicy);
  }

  // Cross-Origin-Embedder-Policy
  if (config.crossOriginEmbedderPolicy) {
    response.headers.set("Cross-Origin-Embedder-Policy", config.crossOriginEmbedderPolicy);
  }

  return response;
}

/**
 * Create a NextResponse with security headers applied
 */
export function createSecureResponse(
  data: unknown,
  init?: ResponseInit,
  config?: SecurityHeaderConfig,
): NextResponse {
  const response = NextResponse.json(data, init);
  const securityConfig = config || (process.env.NODE_ENV === "production" ? defaultSecurityHeaders : developmentSecurityHeaders);

  return applySecurityHeaders(response, securityConfig);
}

/**
 * Middleware to add security headers to all responses
 */
export function securityHeadersMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  const config = process.env.NODE_ENV === "production" ? defaultSecurityHeaders : developmentSecurityHeaders;

  return applySecurityHeaders(response, config);
}
