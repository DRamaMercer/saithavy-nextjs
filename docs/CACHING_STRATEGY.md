# Caching Strategy - Saithavy Next.js Application

## Overview

This document outlines the comprehensive caching strategy for the Saithavy Next.js 16 application, implementing Incremental Static Regeneration (ISR) for optimal performance and user experience.

**Last Updated:** 2026-03-28
**Next.js Version:** 16.1.6
**Cache Grade:** A-

---

## Implementation Summary

### ✅ Completed (Phase 1 & 2)

| Page/Route | Revalidate Time | Strategy | Purpose |
|------------|-----------------|----------|---------|
| `/` (Homepage) | 3600s (1h) | ISR | Hero, announcements, featured content |
| `/resources` | 1800s (30m) | ISR | Resource library updates, new downloads |
| `/resources/[category]/[slug]` | 3600s (1h) | ISR | Resource details, metrics, content updates |
| `/blog` | 3600s (1h) | ISR | Blog index with new posts |
| `/blog/[slug]` | 86400s (24h) | ISR | Blog posts (rarely edited) |
| `/about` | 86400s (24h) | ISR | Static marketing page |
| `/api/resources` | 300s (5m) | ISR | Resource listing API |
| `/api/categories` | 600s (10m) | ISR | Category listing API |
| `/api/resources/[slug]` | 600s (10m) | ISR | Single resource API |

---

## Revalidation Times by Content Type

| Content Type | Revalidate Time | Rationale |
|--------------|-----------------|-----------|
| **Homepage** | 1 hour | Hero section updates, featured content changes |
| **Resource Library** | 30 minutes | New resources, download counts, featured items |
| **Resource Details** | 1 hour | Content updates, metrics, related resources |
| **Blog Index** | 1 hour | New posts appear regularly |
| **Blog Posts** | 24 hours | Rarely edited after publishing |
| **Marketing Pages** | 24 hours | About, Contact - rarely change |
| **API - Listings** | 5-10 minutes | Near real-time data with caching benefits |
| **API - User Actions** | No cache | Dynamic per-request (save, bookmark) |

---

## Edge Function Caching

### Well-Implemented SWR (Stale-While-Revalidate)

| Route | Cache-Control | Strategy |
|-------|---------------|----------|
| `/api/edge/resources` | `s-maxage=3600, stale-while-revalidate=7200` | 1h fresh, 2h SWR |
| `/api/edge/geo-content` | `s-maxage=3600, stale-while-revalidate=86400` | 1h fresh, 24h SWR |
| `/api/edge/geo-lookup` | `s-maxage=300, stale-while-revalidate=600` | 5m fresh, 10m SWR |

### Uncached Routes (Correct)

| Route | Strategy | Purpose |
|-------|----------|---------|
| `/api/edge/health` | `no-store, no-cache, must-revalidate` | Health checks must be fresh |
| `/api/edge/analytics` | `no-store` | User-specific analytics data |

---

## Configuration Changes

### Fixed Conflicts

**Issue:** API routes had both `export const dynamic = "force-dynamic"` AND `export const revalidate`

**Resolution:** Removed `force-dynamic` from:
- ✅ `/api/resources/route.ts`
- ✅ `/api/categories/route.ts`
- ✅ `/api/resources/[slug]/route.ts`

**Kept `force-dynamic` for:**
- `/api/resources/[slug]/save` - User actions (no cache)

---

## Implementation Details

### Adding ISR to a Page

```typescript
// Add this export to your page component
export const revalidate = 3600; // 1 hour in seconds
```

### Example: Resources Page

```typescript
// src/app/resources/page.tsx
import { Metadata } from "next";

// ISR: Revalidate every 30 minutes for resource library updates
export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Resource Hub | Saithavy",
  // ...
};
```

---

## Performance Impact

### Expected Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Server Load | High | Low | **40-60% reduction** |
| Page Load (Cached) | Variable | <100ms | **Instant** |
| API Response Time | 200-500ms | <50ms (cached) | **75% faster** |
| SEO Score | Good | Excellent | Consistent render times |

### Cache Hit Rates (Projected)

| Content Type | Expected Hit Rate |
|--------------|-------------------|
| Homepage | 85-90% |
| Resources | 70-80% |
| Blog Posts | 90-95% |
| API Routes | 60-70% |

---

## On-Demand Revalidation (Future)

### Planned Implementation

For content updates that need immediate propagation:

```typescript
// lib/revalidate.ts
import { revalidatePath } from 'next/cache';

export async function revalidateResourcePage(slug: string) {
  await revalidatePath(`/resources/mindful-leadership/${slug}`);
}

export async function revalidateBlogPost(slug: string) {
  await revalidatePath(`/blog/${slug}`);
}

export async function revalidateResourcesIndex() {
  await revalidatePath('/resources');
}
```

### Usage in Content Management

```typescript
// When content is updated:
await revalidateResourcePage(updatedSlug);
await revalidateResourcesIndex();
```

---

## Monitoring & Validation

### Development

```bash
# Build with ISR
npm run build

# Start production server
npm start

# Verify ISR headers in browser DevTools:
# Network tab > Response Headers > x-nextjs-cache
```

### Production

Monitor cache hit rates using:
- **Vercel Analytics** - Bandwidth savings, cache hit rate
- **Next.js Build Output** - Shows revalidate times
- **Browser DevTools** - Check `x-nextjs-cache` headers

---

## Best Practices Applied

### ✅ DO

1. **Use appropriate revalidation times** based on content change frequency
2. **Remove conflicting settings** (`force-dynamic` with `revalidate`)
3. **Document caching strategy** for team reference
4. **Monitor cache performance** in production
5. **Use SWR for edge functions** (stale-while-revalidate)

### ❌ DON'T

1. **Don't cache user-specific data** (analytics, user actions)
2. **Don't use `force-dynamic` with ISR** (conflicts)
3. **Don't cache health checks** (must be fresh)
4. **Don't forget to document** cache decisions
5. **Don't over-cache static content** (24h is usually enough)

---

## Maintenance

### Quarterly Review

- [ ] Review cache hit rates
- [ ] Adjust revalidation times based on content update patterns
- [ ] Add new pages to caching strategy
- [ ] Remove caching from deprecated routes
- [ ] Update documentation

### Trigger for Review

- Content update frequency changes significantly
- Server load increases unexpectedly
- SEO performance degrades
- User feedback about stale content

---

## References

- [Next.js ISR Documentation](https://nextjs.org/docs/pages/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/caching#on-demand-revalidation)
- [Vercel Edge Network Caching](https://vercel.com/docs/concepts/functions/edge-caching)

---

**Version:** 1.0
**Status:** Active
**Maintained By:** Development Team
