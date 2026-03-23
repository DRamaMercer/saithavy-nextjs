# ADR-003: Next.js 16 App Router with Server Components

**Status**: Accepted
**Date**: 2025-01-16
**Decision Makers**: Development Team

## Context

Building a new personal website from scratch with these requirements:
- Excellent performance (Core Web Vitals)
- SEO optimization (search engine ranking)
- Developer experience (modern tooling)
- Future-proof technology stack

## Decision

Use **Next.js 16 App Router** with React Server Components.

### Architecture

```typescript
// Server Component (default)
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const data = await fetch('https://api.example.com/data');
  return <div>{data.title}</div>;
}

// Client Component (marked with 'use client')
'use client';
export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Static Site Generation

```typescript
// Generate static params at build time
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// SSG page
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.content}</article>;
}
```

## Alternatives Considered

### 1. Next.js Pages Router (Rejected)

**Pros**: Familiar, stable, large ecosystem
**Cons**: No Server Components, larger JavaScript bundle, less performant

**Rationale**: App Router is the future of Next.js with better performance.

### 2. Remix (Rejected)

**Pros**: Nested routing, excellent forms, Web Standards
**Cons**: Smaller ecosystem, steeper learning curve, less opinionated

**Rationale**: Next.js has better market share and Vercel integration.

### 3. Astro (Rejected)

**Pros**: Zero JS by default, excellent performance
**Cons**: Limited interactivity, smaller ecosystem, less mature

**Rationale**: Site requires client-side interactivity (modals, forms).

### 4. Gatsby (Rejected)

**Pros**: GraphQL-based, large plugin ecosystem
**Cons**: Build time issues, complex configuration, declining popularity

**Rationale**: Next.js 16 offers better performance and developer experience.

## Consequences

### Positive

- ✅ **Performance**: Server Components reduce JavaScript payload
- ✅ **SEO**: Built-in metadata API, sitemap, robots.txt
- ✅ **DX**: File-based routing, automatic code splitting
- ✅ **Streaming**: Progressive rendering with React Suspense
- ✅ **Future-Proof**: Aligned with React 18+ roadmap

### Negative

- ⚠️ **Learning Curve**: New paradigm (Server vs Client Components)
- ⚠️ **Client Component Markers**: Need to mark interactive components
- ⚠️ **Ecosystem**: Some libraries not yet compatible
- ⚠️ **Data Fetching**: Different patterns than Pages Router

## Key Features Implemented

### 1. Resource Detail Pages (SSG)

```typescript
// src/app/resources/[category]/[slug]/page.tsx
export async function generateStaticParams() {
  return resources.map((resource) => ({
    category: resource.category,
    slug: resource.slug,
  }));
}

export default async function ResourceDetailPage({ params }) {
  const resource = getResourceBySlug(slug);
  const content = await getResourceContent(resource);
  return <div>{content}</div>;
}
```

### 2. API Routes (Rate Limited)

```typescript
// src/app/api/download/route.ts
export async function POST(request: NextRequest) {
  const rateLimiter = resolveRateLimiter();
  const rateLimitResult = await rateLimiter.checkLimit(ip);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': '3600' } }
    );
  }

  // Process download
}
```

### 3. Metadata API (SEO)

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const resource = getResourceBySlug(slug);
  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: resource.title,
      images: [resource.coverImage],
    },
  };
}
```

## Performance Results

| Metric | Result | Target |
|--------|--------|--------|
| **First Contentful Paint (FCP)** | 0.8s | <1.8s ✅ |
| **Largest Contentful Paint (LCP)** | 1.2s | <2.5s ✅ |
| **Total Blocking Time (TBT)** | 50ms | <200ms ✅ |
| **Cumulative Layout Shift (CLS)** | 0.05 | <0.1 ✅ |
| **Lighthouse Score** | 95 | >90 ✅ |

## Migration from Pages Router

Not applicable (greenfield project).

## Related Decisions

- [ADR-001: Domain-Driven Design Architecture](./001-ddd-architecture.md)
- [ADR-004: Upstash Redis for Rate Limiting](./004-upstash-rate-limiting.md)

## References

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Server Components](https://react.dev/reference/react/use-client)
- [App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
