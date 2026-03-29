# ISR Quick Reference Guide

Quick reference for ISR implementation in your Next.js 16 application.

---

## Revalidation Times at a Glance

| Content Type | Revalidate | Dynamic | Files |
|--------------|-----------|---------|-------|
| **Homepage** | `86400` (24h) | `force-static` | `src/app/page.tsx` |
| **About** | `86400` (24h) | `force-static` | `src/app/about/page.tsx` |
| **Resources** | `3600` (1h) | `error` | `src/app/resources/[category]/[slug]/page.tsx` |
| **Resource Categories** | `3600` (1h) | `error` | `src/app/resources/[category]/page.tsx` |
| **Resources Listing** | `3600` (1h) | `error` | `src/app/resources/page.tsx` |
| **Blog Posts** | `900` (15m) | `error` | `src/app/blog/[slug]/page.tsx` |
| **Blog Listing** | `900` (15m) | `error` | `src/app/blog/page.tsx` |
| **Lead Magnets** | `false` | `force-dynamic` | `src/app/lead-magnets/*/page.tsx` |

---

## Cache Headers Quick Reference

### API Routes - Public Data

```typescript
headers: {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  'CDN-Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
  'Vary': 'Accept-Encoding',
}
```

**Apply to**:
- `/api/resources`
- `/api/categories`
- `/api/edge/resources`

### API Routes - User Actions

```typescript
headers: {
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
}
```

**Apply to**:
- `/api/contact`
- `/api/lead-capture`
- `/api/download`

### Edge Functions

```typescript
headers: {
  'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  'CDN-Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
}
```

**Apply to**:
- `/api/edge/*`

---

## Page Component Template

Add this to every page component (adjust values as needed):

```typescript
// ISR Configuration
export const revalidate = 3600; // 1 hour for resources
export const dynamic = 'error'; // ISR mode (serve stale on error)

export default async function MyPage() {
  // Component code
}
```

---

## On-Demand Revalidation

### Revalidate a Path

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_SECRET",
    "path": "/resources/ai-automation/my-resource"
  }'
```

### Revalidate by Tag

```bash
curl -X POST https://your-domain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "YOUR_SECRET",
    "tag": "resources"
  }'
```

### Available Tags

- `resources` - All resource pages
- `blog` - All blog posts
- `home` - Homepage
- `categories` - Category pages
- `lead-magnets` - Lead magnet pages

---

## Code Snippets

### Import Revalidation Functions

```typescript
import {
  revalidateResource,
  revalidateBlogPost,
  revalidateAllResources,
  revalidateHomePage,
} from '@/lib/revalidation';
```

### Revalidate in Server Actions

```typescript
'use server';

import { revalidateResource } from '@/lib/revalidation';

export async function updateResource(formData: FormData) {
  // Update logic here...

  // Revalidate
  await revalidateResource('my-slug', 'ai-automation');

  return { success: true };
}
```

### Revalidate in API Routes

```typescript
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  // Update logic here...

  // Revalidate
  revalidatePath('/resources/ai-automation/my-resource');

  return NextResponse.json({ success: true });
}
```

---

## Testing Commands

### Check Cache Headers

```bash
# Homepage
curl -I https://your-domain.com/

# API route
curl -I https://your-domain.com/api/resources

# Resource page
curl -I https://your-domain.com/resources/ai-automation/my-resource
```

### Verify ISR in Build

```bash
npm run build

# Look for:
# ○ ISR (Static)  /resources/ai-automation/my-resource [Revalidate in 3600s]
```

---

## Environment Variables

```bash
# .env.local
REVALIDATION_SECRET=your-random-secret-here
WEBHOOK_SECRET=your-webhook-secret-here
NEXT_PUBLIC_SITE_URL=https://saithavy.com
```

### Generate Secure Secrets

```bash
# Generate revalidation secret
openssl rand -base64 32

# Generate webhook secret
openssl rand -base64 32
```

---

## Common Patterns

### Static Page (Homepage, About)

```typescript
export const revalidate = 86400; // 24 hours
export const dynamic = 'force-static';
```

### ISR Page (Resources, Blog)

```typescript
export const revalidate = 3600; // 1 hour
export const dynamic = 'error'; // Serve stale on error
```

### Dynamic Page (Lead Magnets)

```typescript
export const revalidate = false; // On-demand only
export const dynamic = 'force-dynamic'; // Always dynamic
```

---

## Troubleshooting

### Pages Not Revalidating

1. Check `REVALIDATION_SECRET` is correct
2. Verify path exists
3. Check server logs
4. Test with `/api/revalidate` endpoint

### Cache Headers Not Working

1. Check `next.config.ts` headers config
2. Verify no conflicting headers
3. Test with `curl -I`
4. Clear CDN cache

### Build Fails

1. Check for syntax errors
2. Verify imports
3. Check TypeScript types
4. Review build output

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/revalidation.ts` | Revalidation helper functions |
| `src/lib/fetchWithCache.ts` | Cached fetch wrapper |
| `src/app/api/revalidate/route.ts` | Revalidation API endpoint |
| `src/app/api/webhooks/content-update/route.ts` | Webhook handler |
| `next.config.ts` | Cache headers configuration |
| `.env.local` | Environment variables |

---

## Implementation Order

1. ✅ Create `src/lib/revalidation.ts`
2. ✅ Create `src/app/api/revalidate/route.ts`
3. ✅ Update all page files with ISR config
4. ✅ Update all API routes with cache headers
5. ✅ Update `next.config.ts` with headers
6. ✅ Set environment variables
7. ✅ Test locally (`npm run build && npm start`)
8. ✅ Deploy to staging
9. ✅ Test revalidation endpoints
10. ✅ Deploy to production

---

## CDN Configuration

### Vercel (Automatic)

No additional configuration needed. Vercel automatically respects:
- `s-maxage` for CDN caching
- `stale-while-revalidate` for background revalidation

### Custom CDN

Set these headers:
```
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
CDN-Cache-Control: public, s-maxage=600, stale-while-revalidate=1200
```

---

## Performance Expectations

After implementing ISR:

- **80% faster** page loads for static content
- **Zero downtime** during content updates
- **90%+ cache hit rate** for static pages
- **Reduced serverless function invocations**
- **Lower infrastructure costs**

---

## Monitoring

### Key Metrics

- Cache hit rate
- Revalidation time
- Stale content serve rate
- Error rate

### Vercel Analytics

Automatically tracks:
- Page views
- Cache hit/miss
- Edge function invocations

---

## Support & Resources

- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Next.js Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating)
- [Vercel Caching](https://vercel.com/docs/concepts/edge-network/caching)

---

**Last Updated**: 2025-03-28
**Next.js Version**: 16
**Strategy Version**: 1.0
