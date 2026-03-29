# ISR Implementation Guide - File-by-File Changes

This guide provides the exact code changes needed for each file to implement the ISR caching strategy.

---

## Table of Contents

1. [New Files to Create](#new-files-to-create)
2. [Page Components to Update](#page-components-to-update)
3. [API Routes to Update](#api-routes-to-update)
4. [Configuration Files](#configuration-files)
5. [Environment Variables](#environment-variables)
6. [Testing Commands](#testing-commands)

---

## New Files to Create

### 1. Revalidation Library

**File**: `src/lib/revalidation.ts`

```typescript
/**
 * Revalidation Utilities
 *
 * Helper functions for on-demand revalidation of ISR pages
 */

import { revalidatePath, revalidateTag } from 'next/cache';
import { logger } from '@/lib/logger';

export const REVALIDATION_TAGS = {
  RESOURCES: 'resources',
  BLOG: 'blog',
  HOME: 'home',
  CATEGORIES: 'categories',
  LEAD_MAGNETS: 'lead-magnets',
} as const;

export type RevalidationTag = typeof REVALIDATION_TAGS[keyof typeof REVALIDATION_TAGS];

/**
 * Revalidate a specific resource page
 * @param slug - Resource slug
 * @param category - Resource category
 */
export async function revalidateResource(slug: string, category: string) {
  try {
    const path = `/resources/${category}/${slug}`;
    revalidatePath(path);
    revalidateTag(REVALIDATION_TAGS.RESOURCES);
    logger.info('Resource revalidated', { slug, category, path });
  } catch (error) {
    logger.error('Failed to revalidate resource', { slug, category }, error as Error);
    throw error;
  }
}

/**
 * Revalidate all resource pages
 */
export async function revalidateAllResources() {
  try {
    revalidatePath('/resources');
    revalidateTag(REVALIDATION_TAGS.RESOURCES);
    revalidateTag(REVALIDATION_TAGS.CATEGORIES);
    logger.info('All resources revalidated');
  } catch (error) {
    logger.error('Failed to revalidate all resources', {}, error as Error);
    throw error;
  }
}

/**
 * Revalidate a blog post
 * @param slug - Blog post slug
 */
export async function revalidateBlogPost(slug: string) {
  try {
    const path = `/blog/${slug}`;
    revalidatePath(path);
    revalidatePath('/blog');
    revalidateTag(REVALIDATION_TAGS.BLOG);
    logger.info('Blog post revalidated', { slug, path });
  } catch (error) {
    logger.error('Failed to revalidate blog post', { slug }, error as Error);
    throw error;
  }
}

/**
 * Revalidate homepage
 */
export async function revalidateHomePage() {
  try {
    revalidatePath('/');
    revalidateTag(REVALIDATION_TAGS.HOME);
    logger.info('Homepage revalidated');
  } catch (error) {
    logger.error('Failed to revalidate homepage', {}, error as Error);
    throw error;
  }
}

/**
 * Revalidate lead magnet page
 * @param slug - Lead magnet slug
 */
export async function revalidateLeadMagnet(slug: string) {
  try {
    const path = `/lead-magnets/${slug}`;
    revalidatePath(path);
    revalidateTag(REVALIDATION_TAGS.LEAD_MAGNETS);
    logger.info('Lead magnet revalidated', { slug, path });
  } catch (error) {
    logger.error('Failed to revalidate lead magnet', { slug }, error as Error);
    throw error;
  }
}

/**
 * Revalidate by tag
 * @param tag - Cache tag to revalidate
 */
export async function revalidateByTag(tag: RevalidationTag) {
  try {
    revalidateTag(tag);
    logger.info('Tag revalidated', { tag });
  } catch (error) {
    logger.error('Failed to revalidate tag', { tag }, error as Error);
    throw error;
  }
}
```

---

### 2. Cached Fetch Wrapper

**File**: `src/lib/fetchWithCache.ts`

```typescript
/**
 * Cached Fetch Wrapper
 *
 * Provides consistent caching behavior for fetch requests
 */

interface CachedFetchOptions extends RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

interface FetchWithCacheConfig {
  revalidate?: number | false;
  tags?: string[];
  timeout?: number;
}

/**
 * Fetch with caching options
 * @param url - URL to fetch
 * @param config - Cache configuration
 * @returns Fetch response
 */
export async function fetchWithCache<T = any>(
  url: string,
  config: FetchWithCacheConfig = {}
): Promise<T> {
  const { revalidate = 300, tags = [], timeout = 10000 } = config;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
      next: {
        revalidate,
        tags,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Predefined cache configurations
 */
export const CacheConfig = {
  // Static content (24 hours)
  STATIC: {
    revalidate: 86400,
    tags: ['static'],
  },

  // Resources (1 hour)
  RESOURCES: {
    revalidate: 3600,
    tags: ['resources'],
  },

  // Blog posts (15 minutes)
  BLOG: {
    revalidate: 900,
    tags: ['blog'],
  },

  // API data (5 minutes)
  API: {
    revalidate: 300,
    tags: ['api'],
  },

  // No cache (dynamic only)
  NO_CACHE: {
    revalidate: false,
  },
} as const;
```

---

### 3. Revalidation API Route

**File**: `src/app/api/revalidate/route.ts`

```typescript
/**
 * Revalidation API Route
 *
 * Secure endpoint for on-demand revalidation of ISR pages
 *
 * POST /api/revalidate
 * Body: { secret: string, path?: string, tag?: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logger } from '@/lib/logger';
import { REVALIDATION_TAGS } from '@/lib/revalidation';

// Secret token to prevent unauthorized revalidation
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

type RevalidateBody = {
  secret?: string;
  path?: string;
  tag?: string;
};

/**
 * POST handler - Triggers revalidation
 */
export async function POST(request: NextRequest) {
  try {
    const body: RevalidateBody = await request.json();

    // Verify secret
    if (!body.secret || body.secret !== REVALIDATION_SECRET) {
      logger.warn('Unauthorized revalidation attempt', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Path-based revalidation
    if (body.path) {
      revalidatePath(body.path);
      logger.info('Path revalidated', {
        path: body.path,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({
        revalidated: true,
        now: Date.now(),
        path: body.path,
      });
    }

    // Tag-based revalidation
    if (body.tag) {
      if (!Object.values(REVALIDATION_TAGS).includes(body.tag as any)) {
        return NextResponse.json(
          { error: 'Invalid tag' },
          { status: 400 }
        );
      }

      revalidateTag(body.tag);
      logger.info('Tag revalidated', {
        tag: body.tag,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json({
        revalidated: true,
        now: Date.now(),
        tag: body.tag,
      });
    }

    return NextResponse.json(
      { error: 'No path or tag provided' },
      { status: 400 }
    );
  } catch (error) {
    logger.error('Revalidation error', {}, error as Error);
    return NextResponse.json(
      { error: 'Revalidation failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET handler - Returns revalidation status
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    tags: Object.values(REVALIDATION_TAGS),
    timestamp: new Date().toISOString(),
  });
}

export const dynamic = 'force-dynamic';
```

---

### 4. Webhook Handler (Optional)

**File**: `src/app/api/webhooks/content-update/route.ts`

```typescript
/**
 * Content Update Webhook
 *
 * Receives webhooks from CMS/Headless CMS to trigger revalidation
 *
 * POST /api/webhooks/content-update
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  revalidateResource,
  revalidateBlogPost,
  revalidateAllResources,
  revalidateHomePage,
  revalidateLeadMagnet,
} from '@/lib/revalidation';
import { logger } from '@/lib/logger';
import crypto from 'crypto';

type WebhookPayload = {
  type: 'resource' | 'blog' | 'resources' | 'home' | 'lead-magnet';
  slug?: string;
  category?: string;
  timestamp: string;
};

/**
 * Verify webhook signature
 */
function verifySignature(payload: string, signature: string | null): boolean {
  const webhookSecret = process.env.WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    return false;
  }

  const hmac = crypto.createHmac('sha256', webhookSecret);
  const digest = hmac.update(payload).digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

/**
 * POST handler - Processes webhook
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature');

    // Verify signature
    if (!verifySignature(rawBody, signature)) {
      logger.warn('Invalid webhook signature', {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      });
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: WebhookPayload = JSON.parse(rawBody);

    // Handle different content types
    switch (payload.type) {
      case 'resource':
        if (!payload.slug || !payload.category) {
          return NextResponse.json(
            { error: 'Missing slug or category for resource' },
            { status: 400 }
          );
        }
        await revalidateResource(payload.slug, payload.category);
        break;

      case 'blog':
        if (!payload.slug) {
          return NextResponse.json(
            { error: 'Missing slug for blog post' },
            { status: 400 }
          );
        }
        await revalidateBlogPost(payload.slug);
        break;

      case 'resources':
        await revalidateAllResources();
        break;

      case 'home':
        await revalidateHomePage();
        break;

      case 'lead-magnet':
        if (!payload.slug) {
          return NextResponse.json(
            { error: 'Missing slug for lead magnet' },
            { status: 400 }
          );
        }
        await revalidateLeadMagnet(payload.slug);
        break;

      default:
        logger.warn('Unknown webhook type', {
          type: (payload as any).type,
        });
        return NextResponse.json(
          { error: 'Unknown webhook type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      revalidated: true,
      type: payload.type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('Webhook processing error', {}, error as Error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
```

---

## Page Components to Update

### 1. Homepage

**File**: `src/app/page.tsx`

**Add to the file** (after imports, before component):

```typescript
// ISR Configuration - Static marketing page
export const revalidate = 86400; // 24 hours
export const dynamic = 'force-static'; // Full static generation
```

---

### 2. Resource Detail Page

**File**: `src/app/resources/[category]/[slug]/page.tsx`

**Add after imports**:

```typescript
// ISR Configuration - Resource pages
export const revalidate = 3600; // 1 hour
export const dynamic = 'error'; // ISR mode (serve stale on error)
```

**Update generateStaticParams to include tags** (modify existing function):

```typescript
export async function generateStaticParams() {
  const paths: Array<{ category: string; slug: string }> = [];

  for (const resource of resources) {
    paths.push({
      category: resource.category,
      slug: resource.slug,
    });
  }

  return paths;
}

// Add this new function after generateStaticParams
export function generateStaticParamsCache() {
  return resources.map((resource) => ({
    tags: [`resource-${resource.slug}`, `category-${resource.category}`, 'resources'],
  }));
}
```

---

### 3. Blog Post Page

**File**: `src/app/blog/[slug]/page.tsx`

**Add after imports**:

```typescript
// ISR Configuration - Blog posts
export const revalidate = 900; // 15 minutes
export const dynamic = 'error'; // ISR mode
```

---

### 4. Lead Magnet Pages

**File**: `src/app/lead-magnets/ai-innovation/page.tsx` (and other lead magnet pages)

**Add after imports**:

```typescript
// ISR Configuration - Lead magnets (on-demand only)
export const revalidate = false; // On-demand only
export const dynamic = 'force-dynamic'; // Always dynamic
```

**Apply to all lead magnet pages**:
- `src/app/lead-magnets/ai-innovation/page.tsx`
- `src/app/lead-magnets/mindful-leadership/page.tsx`
- `src/app/lead-magnets/personal-transformation/page.tsx`
- `src/app/lead-magnets/remote-work-mastery/page.tsx`
- `src/app/lead-magnets/resilience-toolkit/page.tsx`

---

### 5. Resource Category Page

**File**: `src/app/resources/[category]/page.tsx`

**Add after imports**:

```typescript
// ISR Configuration - Category pages
export const revalidate = 3600; // 1 hour
export const dynamic = 'error'; // ISR mode
```

---

### 6. Blog Listing Page

**File**: `src/app/blog/page.tsx`

**Add after imports**:

```typescript
// ISR Configuration - Blog listing
export const revalidate = 900; // 15 minutes
export const dynamic = 'error'; // ISR mode
```

---

### 7. Resources Listing Page

**File**: `src/app/resources/page.tsx`

**Add after imports**:

```typescript
// ISR Configuration - Resources listing
export const revalidate = 3600; // 1 hour
export const dynamic = 'error'; // ISR mode
```

---

## API Routes to Update

### 1. Resources API

**File**: `src/app/api/resources/route.ts`

**Add/modify headers in the GET handler**:

```typescript
export async function GET(request: NextRequest) {
  try {
    // ... existing logic ...

    // Build response
    const response: PaginatedResponse = {
      resources: paginatedResources,
      totalCount,
      totalPages,
      currentPage,
      categories,
    };

    // Cache response
    setCache(cacheKey, response);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'CDN-Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
        'Vary': 'Accept-Encoding',
      },
    });
  } catch (error) {
    // ... existing error handling ...
  }
}

// Update export at the bottom
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes
```

---

### 2. Contact API

**File**: `src/app/api/contact/route.ts`

**Add headers to the POST response**:

```typescript
export async function POST(request: NextRequest) {
  try {
    // ... existing logic ...

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    // ... existing error handling ...
  }
}

export const dynamic = 'force-dynamic';
```

---

### 3. Lead Capture API

**File**: `src/app/api/lead-capture/route.ts`

**Add headers to the POST response**:

```typescript
export async function POST(request: NextRequest) {
  try {
    // ... existing logic ...

    return NextResponse.json(
      { success: true, leadId },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    // ... existing error handling ...
  }
}

export const dynamic = 'force-dynamic';
```

---

### 4. Edge Resources API

**File**: `src/app/api/edge/resources/route.ts`

**Already has good caching, just verify**:

```typescript
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // ... existing logic ...

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Content-Location': country,
        'X-Edge-Location': region,
      },
    });
  } catch (error) {
    // ... existing error handling ...
  }
}

export const runtime = 'edge';
```

---

### 5. Categories API

**File**: `src/app/api/categories/route.ts`

**Add cache headers** (create if it doesn't exist or update existing):

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/resourcesData';

export async function GET() {
  return NextResponse.json(categories, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'Vary': 'Accept-Encoding',
    },
  });
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 hour
```

---

## Configuration Files

### 1. Next.js Config

**File**: `next.config.ts`

**Replace the entire file with**:

```typescript
import type { NextConfig } from 'next';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {},

  // Optimize package imports for better tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  // Webpack optimizations for bundle splitting
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // UI libraries chunk (React, Lucide icons)
          'ui-libs': {
            name: 'ui-libs',
            chunks: 'all',
            test: /node_modules\/(react|react-dom|lucide-react)/,
            priority: 20,
          },
          // Utility libraries chunk (date-fns, etc.)
          utils: {
            name: 'utils',
            chunks: 'all',
            test: /node_modules\/(date-fns|reading-time)/,
            priority: 15,
          },
          // Vendor chunk for all other node_modules
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 10,
          },
        },
      };
    }
    return config;
  },

  // Cache headers for different routes
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=600',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(withPWA(nextConfig));
```

---

## Environment Variables

### 1. .env.local

**Add these variables**:

```bash
# Revalidation Secret - Use a cryptographically secure random string
# Generate with: openssl rand -base64 32
REVALIDATION_SECRET=your-super-secret-random-string-here-change-this

# Webhook Secret (if using webhooks)
# Generate with: openssl rand -base64 32
WEBHOOK_SECRET=your-webhook-secret-here-change-this

# Site URL for canonical URLs
NEXT_PUBLIC_SITE_URL=https://saithavy.com
```

### 2. .env.example

**Update the example file**:

```bash
# Revalidation
REVALIDATION_SECRET=your-revalidation-secret

# Webhooks
WEBHOOK_SECRET=your-webhook-secret

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://saithavy.com
```

---

## Testing Commands

### 1. Test Cache Headers

```bash
# Test homepage cache headers
curl -I https://your-domain.com/

# Test API cache headers
curl -I https://your-domain.com/api/resources

# Test resource page cache headers
curl -I https://your-domain.com/resources/ai-automation/test-resource
```

### 2. Test Revalidation

```bash
# Revalidate a specific path
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "path": "/resources/ai-automation/test-resource"
  }'

# Revalidate by tag
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "tag": "resources"
  }'

# Check revalidation status
curl https://your-domain.com/api/revalidate
```

### 3. Test Webhook

```bash
# Test webhook (requires HMAC signature generation)
curl -X POST https://your-domain.com/api/webhooks/content-update \
  -H "Content-Type: application/json" \
  -H "x-webhook-signature: your-signature" \
  -d '{
    "type": "resource",
    "slug": "test-resource",
    "category": "ai-automation",
    "timestamp": "2025-03-28T00:00:00Z"
  }'
```

### 4. Verify Build

```bash
# Build the application
npm run build

# Check for ISR pages in build output
# Look for "○ ISR" indicators in the build log

# Start production server
npm start

# Verify pages load correctly
curl https://localhost:3000/
curl https://localhost:3000/resources
curl https://localhost:3000/blog
```

---

## Verification Checklist

After implementing all changes:

- [ ] All page files have appropriate `export const revalidate`
- [ ] All API routes have appropriate cache headers
- [ ] Revalidation API endpoint works with correct secret
- [ ] Webhook endpoint verifies signatures correctly
- [ ] Build completes successfully with ISR pages
- [ ] Cache headers are correct (test with `curl -I`)
- [ ] On-demand revalidation works
- [ ] Stale content is served during revalidation
- [ ] No-cache headers on user action APIs

---

## Troubleshooting

### Issue: Pages not revalidating

**Solution**:
1. Check `REVALIDATION_SECRET` is set correctly
2. Verify revalidate path/tag exists
3. Check server logs for errors
4. Test with `/api/revalidate` endpoint

### Issue: Cache headers not working

**Solution**:
1. Verify `next.config.ts` headers configuration
2. Check for conflicting headers in API routes
3. Test with `curl -I` to see actual headers
4. Clear CDN cache and retry

### Issue: Build fails

**Solution**:
1. Check for syntax errors in new files
2. Verify all imports are correct
3. Ensure TypeScript types are valid
4. Check `npm run build` output for specific errors

---

## Next Steps

1. Implement Phase 1 (Core ISR)
2. Test locally with `npm run build && npm start`
3. Deploy to staging environment
4. Test revalidation endpoints
5. Monitor cache hit rates
6. Implement Phase 2 (API caching)
7. Implement Phase 3 (Webhooks)
8. Full deployment to production
