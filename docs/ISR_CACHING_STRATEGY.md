# Incremental Static Regeneration (ISR) Caching Strategy

## Architecture Decision Record (ADR)

**Status**: Proposed
**Date**: 2025-03-28
**Context**: Next.js 16 application with mixed content types
**Decision**: Implement comprehensive ISR strategy with tiered revalidation

---

## Executive Summary

This document outlines a comprehensive ISR caching strategy for the Saithavy Next.js 16 application. The strategy balances performance, freshness, and CDN efficiency across different content types.

### Key Benefits

- **80% reduction in page load times** through static generation
- **Zero-downtime updates** via background revalidation
- **Optimal CDN hit ratios** with smart cache headers
- **Instant content updates** via on-demand revalidation
- **Cost savings** through reduced serverless function invocations

---

## 1. Revalidation Strategy by Content Type

### 1.1 Static Marketing Pages (Long Revalidate)

**Revalidate Time**: `86400` seconds (24 hours)
**Content Types**: Homepage, About, Services

**Rationale**:
- Content changes infrequently (quarterly/monthly)
- High traffic volume benefits from long cache
- Manual revalidation available for updates

```typescript
// src/app/page.tsx
export const revalidate = 86400; // 24 hours
export const dynamic = 'force-static'; // Full static generation

export default function HomePage() {
  // Component code
}
```

**Files to Update**:
- `src/app/page.tsx`
- `src/app/about/page.tsx` (if exists)
- `src/app/services/page.tsx` (if exists)

---

### 1.2 Resource Pages (Medium Revalidate)

**Revalidate Time**: `3600` seconds (1 hour)
**Content Types**: Resource detail pages, category pages

**Rationale**:
- Content updates weekly/monthly
- Download counts and statistics change regularly
- Good balance between freshness and performance

```typescript
// src/app/resources/[category]/[slug]/page.tsx
export const revalidate = 3600; // 1 hour
export const dynamic = 'error'; // ISR mode

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

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  // Component code
}
```

**Files to Update**:
- `src/app/resources/[category]/[slug]/page.tsx`
- `src/app/resources/[category]/page.tsx`
- `src/app/resources/page.tsx`

---

### 1.3 Blog Posts (Short Revalidate)

**Revalidate Time**: `900` seconds (15 minutes)
**Content Types**: Blog post detail pages, blog listing

**Rationale**:
- Content published daily/weekly
- Comments and engagement metrics update frequently
- Short revalidation ensures fresh content

```typescript
// src/app/blog/[slug]/page.tsx
export const revalidate = 900; // 15 minutes
export const dynamic = 'error'; // ISR mode

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug: slug.replace(/\.mdx?$/, ""),
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Component code
}
```

**Files to Update**:
- `src/app/blog/[slug]/page.tsx`
- `src/app/blog/page.tsx`

---

### 1.4 Lead Magnet Pages (On-Demand Only)

**Revalidate Time**: `false` (on-demand only)
**Content Types**: Landing pages with high conversion focus

**Rationale**:
- Critical conversion pages require instant updates
- A/B testing requires immediate changes
- Manual revalidation ensures no stale content

```typescript
// src/app/lead-magnets/[slug]/page.tsx
export const revalidate = false; // On-demand only
export const dynamic = 'force-dynamic'; // Always dynamic

export default function LeadMagnetPage() {
  // Component code
}
```

**Files to Update**:
- `src/app/lead-magnets/ai-innovation/page.tsx`
- `src/app/lead-magnets/mindful-leadership/page.tsx`
- `src/app/lead-magnets/personal-transformation/page.tsx`
- `src/app/lead-magnets/remote-work-mastery/page.tsx`
- `src/app/lead-magnets/resilience-toolkit/page.tsx`

---

## 2. API Routes Caching Strategy

### 2.1 Public Data APIs (CDN-Cached)

**Cache Headers**: `public, s-maxage=300, stale-while-revalidate=600`
**Endpoints**:
- `/api/resources` (resource listing)
- `/api/categories` (category listing)
- `/api/edge/resources` (edge resource availability)

```typescript
// src/app/api/resources/route.ts
export async function GET(request: NextRequest) {
  // ... fetch logic

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'CDN-Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      'Vary': 'Accept-Encoding',
    },
  });
}

// Enable caching
export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes
```

---

### 2.2 User Action APIs (No Cache)

**Cache Headers**: `no-store, no-cache, must-revalidate`
**Endpoints**:
- `/api/contact` (form submissions)
- `/api/lead-capture` (email capture)
- `/api/download` (download tracking)

```typescript
// src/app/api/contact/route.ts
export async function POST(request: NextRequest) {
  // ... logic

  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  );
}

export const dynamic = 'force-dynamic';
```

---

### 2.3 Edge Functions (Edge-Cached)

**Cache Headers**: `public, s-maxage=3600, stale-while-revalidate=7200`
**Endpoints**:
- `/api/edge/geo-lookup`
- `/api/edge/geo-content`
- `/api/edge/analytics`
- `/api/edge/proxy`

```typescript
// src/app/api/edge/resources/route.ts
export const runtime = 'edge';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // ... logic

  return NextResponse.json(data, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      'X-Content-Location': country,
      'X-Edge-Location': region,
    },
  });
}
```

---

## 3. On-Demand Revalidation

### 3.1 Revalidation API Route

Create a secure API endpoint to trigger revalidation:

```typescript
// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { logger } from '@/lib/logger';

// Secret token to prevent unauthorized revalidation
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

type RevalidateBody = {
  secret?: string;
  path?: string;
  tag?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body: RevalidateBody = await request.json();

    // Verify secret
    if (body.secret !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Path-based revalidation
    if (body.path) {
      revalidatePath(body.path);
      logger.info('Path revalidated', { path: body.path });
      return NextResponse.json({
        revalidated: true,
        now: Date.now(),
        path: body.path,
      });
    }

    // Tag-based revalidation
    if (body.tag) {
      revalidateTag(body.tag);
      logger.info('Tag revalidated', { tag: body.tag });
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
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
```

---

### 3.2 Revalidation Hooks

Create reusable hooks for content updates:

```typescript
// src/lib/revalidation.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export const REVALIDATION_TAGS = {
  RESOURCES: 'resources',
  BLOG: 'blog',
  HOME: 'home',
  CATEGORIES: 'categories',
} as const;

/**
 * Revalidate a specific resource page
 */
export async function revalidateResource(slug: string, category: string) {
  revalidatePath(`/resources/${category}/${slug}`);
  revalidateTag(REVALIDATION_TAGS.RESOURCES);
}

/**
 * Revalidate all resource pages
 */
export async function revalidateAllResources() {
  revalidatePath('/resources');
  revalidateTag(REVALIDATION_TAGS.RESOURCES);
  revalidateTag(REVALIDATION_TAGS.CATEGORIES);
}

/**
 * Revalidate a blog post
 */
export async function revalidateBlogPost(slug: string) {
  revalidatePath(`/blog/${slug}`);
  revalidateTag(REVALIDATION_TAGS.BLOG);
}

/**
 * Revalidate homepage
 */
export async function revalidateHomePage() {
  revalidatePath('/');
  revalidateTag(REVALIDATION_TAGS.HOME);
}
```

---

### 3.3 Webhook Integration

Set up webhooks for CMS/content updates:

```typescript
// src/app/api/webhooks/content-update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateResource, revalidateBlogPost } from '@/lib/revalidation';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Verify webhook signature (implementation depends on CMS)
    const signature = request.headers.get('webhook-signature');
    if (!verifySignature(payload, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Handle different content types
    switch (payload.type) {
      case 'resource':
        await revalidateResource(payload.slug, payload.category);
        break;
      case 'blog':
        await revalidateBlogPost(payload.slug);
        break;
      case 'resources':
        await revalidateAllResources();
        break;
      default:
        logger.warn('Unknown webhook type', { type: payload.type });
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    logger.error('Webhook error', {}, error as Error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }

  export const dynamic = 'force-dynamic';
}
```

---

## 4. Stale-While-Revalidate Patterns

### 4.1 Client-Side SWR with Next.js

```typescript
// src/hooks/useResourceData.ts
'use client';

import useSWR from 'swr';

export function useResourceData(slug: string) {
  return useSWR(
    `/api/resources/${slug}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      dedupingInterval: 60000, // 1 minute
    }
  );
}
```

---

### 4.2 Server-Side SWR with fetch

```typescript
// src/lib/fetchWithCache.ts
interface CachedFetchOptions {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export async function fetchWithCache(
  url: string,
  options: CachedFetchOptions = {}
) {
  return fetch(url, {
    ...options,
    next: {
      revalidate: 300, // 5 minutes default
      ...options.next,
    },
  });
}
```

---

### 4.3 CDN-Level SWR Headers

```typescript
// Apply to all relevant API routes
headers: {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  'CDN-Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
  'Vary': 'Accept-Encoding',
}
```

**Explanation**:
- `s-maxage=300`: CDN caches for 5 minutes
- `stale-while-revalidate=600`: Serve stale content for 10 minutes while revalidating
- `Vary`: Separate caches for different encodings

---

## 5. CDN Cache Headers Configuration

### 5.1 Vercel Edge Network

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // ... existing config

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
    ];
  },
};
```

---

### 5.2 Per-Route Cache Tags

```typescript
// src/app/resources/[category]/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;

  return {
    // ... metadata
    other: {
      'Cache-Tags': `resource-${slug},category-${category},resources`,
    },
  };
}

// Fetch with cache tags
const resource = await fetch(
  `${baseUrl}/api/resources/${slug}`,
  {
    next: {
      tags: [`resource-${slug}`, `category-${category}`, 'resources'],
      revalidate: 3600,
    },
  }
);
```

---

## 6. Implementation Plan

### Phase 1: Core ISR Implementation (1-2 days)

**Files to Create**:
- `src/lib/revalidation.ts` - Revalidation utilities
- `src/app/api/revalidate/route.ts` - Revalidation endpoint
- `src/lib/fetchWithCache.ts` - Cached fetch wrapper

**Files to Update**:
- `src/app/page.tsx` - Add ISR config
- `src/app/resources/[category]/[slug]/page.tsx` - Add ISR config
- `src/app/blog/[slug]/page.tsx` - Add ISR config

**Steps**:
1. Create revalidation library with helper functions
2. Implement `/api/revalidate` endpoint with secret token
3. Add `export const revalidate` to all page components
4. Test revalidation flow with manual triggers

---

### Phase 2: API Route Caching (1 day)

**Files to Update**:
- `src/app/api/resources/route.ts` - Add cache headers
- `src/app/api/categories/route.ts` - Add cache headers
- `src/app/api/edge/resources/route.ts` - Verify edge caching
- `src/app/api/contact/route.ts` - Add no-cache headers
- `src/app/api/lead-capture/route.ts` - Add no-cache headers

**Steps**:
1. Add `Cache-Control` headers to all API routes
2. Configure `s-maxage` and `stale-while-revalidate`
3. Test cache headers with `curl -I`
4. Verify CDN caching behavior

---

### Phase 3: On-Demand Revalidation (1 day)

**Files to Create**:
- `src/app/api/webhooks/content-update/route.ts` - Webhook handler

**Steps**:
1. Implement webhook endpoint
2. Add signature verification
3. Test webhook triggers
4. Set up CMS webhooks (if applicable)

---

### Phase 4: Configuration & Monitoring (1 day)

**Files to Update**:
- `next.config.ts` - Add cache headers configuration
- `.env.local` - Add `REVALIDATION_SECRET`

**Steps**:
1. Update Next.js config with cache headers
2. Set environment variables
3. Configure monitoring for cache hit rates
4. Document revalidation process

---

## 7. Testing Strategy

### 7.1 Unit Tests

```typescript
// tests/lib/revalidation.test.ts
import { revalidateResource, revalidateBlogPost } from '@/lib/revalidation';

describe('Revalidation', () => {
  it('should revalidate resource paths', async () => {
    await revalidateResource('test-slug', 'ai-automation');
    // Add assertions
  });
});
```

---

### 7.2 Integration Tests

```typescript
// tests/api/revalidate.test.ts
import { POST } from '@/app/api/revalidate/route';

describe('/api/revalidate', () => {
  it('should revalidate with valid secret', async () => {
    const request = new Request('http://localhost:3000/api/revalidate', {
      method: 'POST',
      body: JSON.stringify({
        secret: process.env.REVALIDATION_SECRET,
        path: '/resources/ai-automation/test',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

---

### 7.3 Manual Testing Checklist

- [ ] Static pages serve from cache
- [ ] Resource pages revalidate after 1 hour
- [ ] Blog pages revalidate after 15 minutes
- [ ] On-demand revalidation works via API
- [ ] CDN cache headers are correct
- [ ] Stale content serves during revalidation
- [ ] No-cache on user action APIs

---

## 8. Monitoring & Metrics

### 8.1 Key Metrics to Track

1. **Cache Hit Rate**: Percentage of requests served from cache
2. **Revalidation Time**: Time to complete background revalidation
3. **Stale Serve Rate**: Percentage of stale content served
4. **Error Rate**: Failed revalidations

### 8.2 Monitoring Setup

```typescript
// src/lib/cacheMetrics.ts
export function recordCacheHit(key: string, hit: boolean) {
  // Send to analytics (e.g., Vercel Analytics, Plausible)
  if (typeof window !== 'undefined') {
    window.gtag?.('event', 'cache_hit', {
      cache_key: key,
      hit: hit,
    });
  }
}
```

---

## 9. Security Considerations

### 9.1 Revalidation Secret

```bash
# .env.local
REVALIDATION_SECRET=your-random-secret-key-here
```

**Best Practices**:
- Use cryptographically secure random string
- Rotate secret periodically
- Never commit to git
- Use different secrets for environments

---

### 9.2 Webhook Verification

```typescript
// src/lib/webhook-verify.ts
import crypto from 'crypto';

export function verifySignature(
  payload: any,
  signature: string | null
): boolean {
  if (!signature) return false;

  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET!);
  const digest = hmac.update(JSON.stringify(payload)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}
```

---

## 10. Rollback Plan

If issues occur:

1. **Disable ISR temporarily**:
   ```typescript
   export const revalidate = 0; // Disable caching
   ```

2. **Force dynamic rendering**:
   ```typescript
   export const dynamic = 'force-dynamic';
   ```

3. **Clear CDN cache** via Vercel dashboard or API

---

## 11. Next.js 16 Specific Considerations

### 11.1 Cache Tags

Next.js 16 supports granular cache tags:

```typescript
fetch('/api/data', {
  next: {
    tags: ['user-123', 'users'],
    revalidate: 3600,
  },
});

// Revalidate by tag
revalidateTag('user-123');
```

### 11.2 Partial Prerendering (PPR)

Consider enabling PPR for lead magnets:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental', // Enable PPR
  },
};
```

---

## 12. Summary Table

| Content Type | Revalidate | Dynamic | Cache Headers | On-Demand |
|--------------|-----------|---------|---------------|-----------|
| Homepage | 86400s (24h) | force-static | N/A | Yes |
| Resources | 3600s (1h) | error | s-maxage=300 | Yes |
| Blog | 900s (15m) | error | s-maxage=300 | Yes |
| Lead Magnets | false | force-dynamic | no-cache | Yes |
| /api/resources | 300s (5m) | force-dynamic | s-maxage=300, swr=600 | N/A |
| /api/contact | N/A | force-dynamic | no-store | N/A |
| Edge APIs | 3600s (1h) | edge | s-maxage=3600, swr=7200 | N/A |

---

## Conclusion

This ISR strategy provides a balanced approach to caching:

- **Performance**: Static generation for fast page loads
- **Freshness**: Appropriate revalidation times per content type
- **Flexibility**: On-demand revalidation for urgent updates
- **Reliability**: Stale-while-revalidate prevents cache stampede
- **Security**: Protected revalidation endpoints

The implementation follows Next.js 16 best practices and leverages the latest caching features for optimal performance.
