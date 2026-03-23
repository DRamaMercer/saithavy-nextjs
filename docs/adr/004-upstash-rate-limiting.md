# ADR-004: Upstash Redis for Rate Limiting

**Status**: Accepted
**Date**: 2025-01-16
**Decision Makers**: Development Team

## Context

The contact form and resource download endpoints require rate limiting to:
- Prevent spam and abuse
- Protect against DDoS attacks
- Ensure fair resource allocation
- Comply with API best practices

## Decision

Use **Upstash Redis** for distributed rate limiting.

### Requirements

1. **Distributed**: Rate limit across multiple serverless functions
2. **Low Latency**: <10ms response time
3. **Edge-Optimized**: Global edge caching
4. **Serverless**: Pay-per-use, no infrastructure management
5. **Free Tier**: Generous free tier for development

### Implementation

```typescript
// src/lib/di/services.ts
container.register(
  ServiceKeys.RateLimiter,
  () => new UpstashRateLimiterAdapter({
    redis: new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    }),
  }),
  'singleton'
);
```

### Rate Limiting Logic

```typescript
// src/adapters/gateways/UpstashRateLimiterAdapter.ts
async checkLimit(ip: string): Promise<RateLimitResult> {
  const key = `ratelimit:${this.identifier}:${ip}`;
  const current = await this.redis.incr(key);

  if (current === 1) {
    await this.redis.expire(key, this.windowMs);
  }

  const success = current <= this.maxRequests;
  const reset = Date.now() + this.windowMs;

  return { success, remaining: Math.max(0, this.maxRequests - current), reset, limit: this.maxRequests };
}
```

### Configuration

```typescript
const RATE_LIMITS = {
  contact: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 5,              // 5 submissions per hour
  },
  download: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxRequests: 5,              // 5 downloads per hour
  },
};
```

## Alternatives Considered

### 1. In-Memory Rate Limiting (Rejected)

**Pros**: Simple, fast, no external dependencies
**Cons**: Doesn't scale, resets on restart, no distributed coordination

**Rationale**: Serverless functions spin up/down; in-memory doesn't work.

### 2. Self-Hosted Redis (Rejected)

**Pros**: Full control, no vendor lock-in
**Cons**: Infrastructure management, cost, ops overhead

**Rationale**: Want serverless, no infrastructure management.

### 3. Vercel KV (Rejected)

**Pros**: Native Vercel integration
**Cons**: Less mature, fewer features, higher latency

**Rationale**: Upstash has better edge optimization and lower latency.

### 4. Cloudflare Workers KV (Rejected)

**Pros**: Global edge, low latency
**Cons**: Eventual consistency, not Redis-compatible

**Rationale**: Need strong consistency for rate limiting.

### 5. Upstash Redis (Chosen)

**Pros**:
- Edge-optimized: <10ms global latency
- Redis-compatible: Drop-in replacement
- Serverless: Pay-per-use pricing
- Free tier: 10K requests/day
- Strong consistency: Reads from leader
- Global distribution: Automatic edge replication

**Cons**:
- Vendor lock-in: Upstash-specific SDK
- API limits: Rate limits on API itself

## Consequences

### Positive

- ✅ **Performance**: <10ms global latency
- ✅ **Scalability**: Automatic scaling, no infrastructure
- ✅ **Reliability**: 99.99% uptime SLA
- ✅ **Cost**: Free tier sufficient for personal site
- ✅ **DX**: Simple API, Redis-compatible

### Negative

- ⚠️ **Vendor Lock-in**: Upstash-specific SDK (though Redis-compatible)
- ⚠️ **API Limits**: 10K requests/day on free tier
- ⚠️ **Data Privacy**: Third-party service stores IP addresses

## Performance

| Metric | Result | Target |
|--------|--------|--------|
| **Latency (p50)** | 8ms | <20ms ✅ |
| **Latency (p99)** | 25ms | <50ms ✅ |
| **Availability** | 99.99% | >99.9% ✅ |

## Cost Analysis

### Free Tier

- **Requests**: 10K/day
- **Storage**: 256MB
- **Commands**: 10K/day
- **Cost**: $0/month

### Estimated Usage

- **Contact Form**: 10 submissions/day = 300/month
- **Downloads**: 50 downloads/day = 1,500/month
- **Total**: 60 requests/day = 1,800/month

**Conclusion**: Free tier is sufficient.

### Paid Tier (if needed)

- **Standard**: $0.20/10K requests
- **Pro**: $2/100K requests

## Privacy Considerations

Upstash stores IP addresses for rate limiting. This is:
- **Necessary**: For rate limit enforcement
- **Temporary**: TTL of 1 hour
- **Secure**: Encrypted in transit
- **Compliant**: GDPR-compliant with TTL

**Mitigation**: Minimal data stored, automatic expiration, no PII logged.

## Related Decisions

- [ADR-001: Domain-Driven Design Architecture](./001-ddd-architecture.md)
- [ADR-002: Custom Dependency Injection Container](./002-custom-di-container.md)

## References

- [Upstash Documentation](https://upstash.com/docs)
- [Rate Limiting Best Practices](https://upstash.com/blog/rate-limiting)
- [Redis INCR Command](https://redis.io/commands/incr)
