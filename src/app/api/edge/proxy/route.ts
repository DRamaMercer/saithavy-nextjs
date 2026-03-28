/**
 * Edge Function: Content Proxy with Caching
 *
 * Runtime: Edge (Vercel Edge Network)
 * Purpose: Proxy external APIs with edge caching
 * Cache: Configurable per proxy type
 */

import { NextRequest, NextResponse } from "next/server";
import { edgeLogger } from "@/lib/edge-logger";

export const runtime = "edge";

/**
 * Proxy configuration
 */
interface ProxyConfig {
  targetUrl: string;
  cacheTime: number;
  headers?: Record<string, string>;
  transformResponse?: (data: Record<string, unknown>, request: NextRequest) => Record<string, unknown>;
}

const proxyConfigs: Record<string, ProxyConfig> = {
  // Example: Proxy blog posts from external API
  blog: {
    targetUrl: "https://jsonplaceholder.typicode.com/posts",
    cacheTime: 300, // 5 minutes
    headers: {
      "User-Agent": "Saithavy-Blog-Proxy/1.0",
    },
    transformResponse: (data, request) => ({
      ...data,
      _proxied: {
        timestamp: new Date().toISOString(),
        location: request.headers.get("x-vercel-ip-country") || "unknown",
      },
    }),
  },

  // Example: Proxy user data (future integration)
  user: {
    targetUrl: "https://api.example.com/users",
    cacheTime: 60, // 1 minute
    transformResponse: undefined, // No transformation
  },
};

/**
 * GET handler - Proxies requests to external APIs
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const proxyType = url.searchParams.get("type") || "blog";
    const targetPath = url.searchParams.get("path") || "";

    const config = proxyConfigs[proxyType];

    if (!config) {
      return NextResponse.json(
        {
          error: "Invalid proxy type",
          availableTypes: Object.keys(proxyConfigs),
        },
        { status: 400 },
      );
    }

    // Build target URL
    const targetUrl = `${config.targetUrl}${targetPath}`;

    // Add query parameters if present
    const queryString = url.searchParams.toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    // Make request to target
    const response = await fetch(fullUrl, {
      headers: {
        ...config.headers,
        "X-Forwarded-For": request.headers.get("x-forwarded-for") || "",
        "X-Real-IP": request.headers.get("x-real-ip") || "",
        "X-Forwarded-Host": request.headers.get("x-forwarded-host") || "",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Upstream server error",
          status: response.status,
          statusText: response.statusText,
        },
        { status: response.status },
      );
    }

    // Handle response based on content type
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();

      // Transform response if configured
      const transformedData = config.transformResponse
        ? config.transformResponse(data, request)
        : data;

      return NextResponse.json(transformedData, {
        status: 200,
        headers: {
          "Cache-Control": `public, s-maxage=${config.cacheTime}, stale-while-revalidate=${
            config.cacheTime * 2
          }`,
          "X-Proxy-Cache": "MISS",
          "X-Edge-Location":
            request.headers.get("x-vercel-ip-region") || "unknown",
        },
      });
    } else {
      // For non-JSON responses, pass through
      const blob = await response.blob();

      return new NextResponse(blob, {
        status: response.status,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": `public, s-maxage=${config.cacheTime}`,
        },
      });
    }
  } catch (error) {
    edgeLogger.error("[Proxy] Error", { url: request.url }, error as Error);

    return NextResponse.json(
      {
        error: "Proxy request failed",
        url: request.url,
      },
      { status: 502 },
    );
  }
}
