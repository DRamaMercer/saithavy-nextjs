# API Rate Limiting and Authentication

## Overview

The Saithavy API implements rate limiting to ensure fair usage and prevent abuse. Rate limits are enforced per IP address and vary by endpoint.

## Rate Limiting Strategy

### How Rate Limiting Works

1. **IP-Based Tracking**: Each client IP address has a separate rate limit quota
2. **Sliding Window**: Rate limits use a time-based sliding window algorithm
3. **Headers**: All responses include rate limit information in HTTP headers
4. **Graceful Degradation**: When limits are exceeded, clients receive clear error messages with retry information

### Rate Limit Headers

Every API response includes these headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1711641600
```

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed in the current time window |
| `X-RateLimit-Remaining` | Number of requests remaining in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the rate limit window resets |
| `Retry-After` | (429 responses only) Seconds until retry is allowed |

## Endpoint-Specific Limits

| Endpoint | Limit | Window | Description |
|----------|-------|--------|-------------|
| `GET /api/resources` | 100 requests | 5 minutes | Resource listing and search |
| `GET /api/categories` | 100 requests | 5 minutes | Category listing |
| `POST /api/contact` | 3 requests | 1 hour | Contact form submissions |
| `POST /api/download` | 5 requests | 1 hour | Download requests |
| `POST /api/pdf` | 10 requests | 1 hour | PDF generation |
| `GET /api/edge/*` | 200 requests | 5 minutes | Edge functions |
| `POST /api/edge/analytics` | 50 requests | 1 minute | Analytics event tracking |

## Rate Limit Responses

### When Limit is Exceeded (429)

When a client exceeds the rate limit, the API returns:

```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 3600
}
```

**HTTP Status**: `429 Too Many Requests`

**Headers**:
```http
Retry-After: 3600
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1711641600
```

## Best Practices

### 1. Monitor Rate Limit Headers

Always inspect rate limit headers in your responses:

```typescript
async function fetchWithRateLimitCheck(url: string) {
  const response = await fetch(url);

  // Extract rate limit info
  const rateLimit = {
    limit: response.headers.get('X-RateLimit-Limit'),
    remaining: response.headers.get('X-RateLimit-Remaining'),
    reset: response.headers.get('X-RateLimit-Reset'),
  };

  // Log or store rate limit info
  console.log(`Rate limit: ${rateLimit.remaining}/${rateLimit.limit}`);

  // Handle rate limit exceeded
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const resetTime = new Date(parseInt(rateLimit.reset!) * 1000);

    console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
    console.log(`Limit resets at ${resetTime.toLocaleString()}`);

    throw new Error(`Rate limit exceeded. Retry at ${resetTime.toLocaleString()}`);
  }

  return response.json();
}
```

### 2. Implement Exponential Backoff

When you hit a rate limit, implement exponential backoff:

```typescript
async function fetchWithBackoff(
  url: string,
  maxRetries = 3
): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);

      // Success - return response
      if (response.ok) {
        return response;
      }

      // Rate limit exceeded - wait and retry
      if (response.status === 429) {
        const retryAfter = parseInt(
          response.headers.get('Retry-After') || '60'
        );

        // Add jitter to avoid thundering herd
        const jitter = Math.random() * 1000;
        const waitTime = (retryAfter * 1000) + jitter;

        console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);

        await new Promise(resolve => setTimeout(resolve, waitTime));

        continue; // Retry
      }

      // Other errors - don't retry
      return response;
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff for network errors
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
}
```

### 3. Client-Side Rate Limiting

Implement client-side throttling to stay within limits:

```typescript
class RateLimitedClient {
  private requestTimestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async makeRequest(url: string): Promise<Response> {
    const now = Date.now();

    // Remove timestamps outside the current window
    this.requestTimestamps = this.requestTimestamps.filter(
      timestamp => now - timestamp < this.windowMs
    );

    // Check if we've hit the limit
    if (this.requestTimestamps.length >= this.maxRequests) {
      const oldestTimestamp = this.requestTimestamps[0];
      const waitTime = this.windowMs - (now - oldestTimestamp);

      console.log(`Client-side rate limit reached. Waiting ${waitTime}ms...`);

      await new Promise(resolve => setTimeout(resolve, waitTime));

      // Recursively retry after waiting
      return this.makeRequest(url);
    }

    // Record this request
    this.requestTimestamps.push(now);

    // Make the actual request
    return fetch(url);
  }
}

// Usage
const client = new RateLimitedClient(100, 5 * 60 * 1000); // 100 requests per 5 minutes
const response = await client.makeRequest('https://saithavy.com/api/resources');
```

### 4. Distributed Rate Limiting

For distributed systems (multiple servers), use Redis for centralized rate limiting:

```typescript
import Redis from 'ioredis';

class DistributedRateLimiter {
  private redis: Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  async checkLimit(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
    const now = Date.now();
    const windowStart = now - windowMs;
    const redisKey = `ratelimit:${key}`;

    // Clean up old entries
    await this.redis.zremrangebyscore(redisKey, 0, windowStart);

    // Count requests in current window
    const count = await this.redis.zcard(redisKey);

    if (count >= limit) {
      // Get oldest timestamp to calculate reset time
      const oldest = await this.redis.zrange(redisKey, 0, 0, 'WITHSCORES');
      const resetAt = new Date(parseInt(oldest[1]) + windowMs);

      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    // Add current request
    await this.redis.zadd(redisKey, now, `${now}-${Math.random()}`);

    // Expire key after window
    await this.redis.expire(redisKey, Math.ceil(windowMs / 1000));

    return {
      allowed: true,
      remaining: limit - count - 1,
      resetAt: new Date(now + windowMs),
    };
  }
}

// Usage in API route
const limiter = new DistributedRateLimiter(process.env.REDIS_URL!);

const result = await limiter.checkLimit(ip, 100, 5 * 60 * 1000);

if (!result.allowed) {
  return NextResponse.json(
    { error: 'Rate limit exceeded', retryAfter: Math.ceil((result.resetAt.getTime() - Date.now()) / 1000) },
    { status: 429 }
  );
}

// Continue with request...
```

## Rate Limiting for Different Use Cases

### Web Applications (Browser)

For client-side web applications:
- Implement client-side caching to reduce API calls
- Use pagination effectively
- Debounce search inputs
- Implement local rate limiting

```typescript
// Debounce search input
import { debounce } from 'lodash';

const searchResources = debounce(async (query: string) => {
  const response = await fetch(`/api/resources?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data;
}, 500); // Wait 500ms after user stops typing

// Usage
searchResources('leadership');
```

### Mobile Applications

For mobile apps:
- Implement aggressive local caching
- Batch requests when possible
- Use background sync for non-critical requests
- Respect rate limits even when offline

```typescript
// Batch multiple requests
async function batchRequests(urls: string[]) {
  const responses = await Promise.all(
    urls.map(url => fetch(url))
  );

  return Promise.all(
    responses.map(response => response.json())
  );
}

// Usage
const data = await batchRequests([
  'https://saithavy.com/api/resources?category=mindful-leadership',
  'https://saithavy.com/api/resources?category=remote-work',
  'https://saithavy.com/api/categories',
]);
```

### Server-to-Server Integration

For backend integrations:
- Use API keys for identification (future feature)
- Implement request queuing
- Use webhooks for asynchronous updates
- Monitor rate limit usage metrics

```typescript
// Request queue
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private readonly concurrency: number;

  constructor(concurrency = 5) {
    this.concurrency = concurrency;
  }

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    const batch = this.queue.splice(0, this.concurrency);

    await Promise.all(
      batch.map(request => request())
    );

    this.processing = false;

    // Process next batch
    if (this.queue.length > 0) {
      this.process();
    }
  }
}

// Usage
const queue = new RequestQueue(5);

const results = await Promise.all([
  queue.add(() => fetch('/api/resources').then(r => r.json())),
  queue.add(() => fetch('/api/categories').then(r => r.json())),
  // ... more requests
]);
```

## Monitoring and Alerting

### Track Rate Limit Usage

```typescript
class RateLimitMonitor {
  private hits: Map<string, number[]> = new Map();

  recordHit(endpoint: string) {
    const now = Date.now();
    const hits = this.hits.get(endpoint) || [];
    hits.push(now);

    // Keep only last hour of data
    const oneHourAgo = now - 60 * 60 * 1000;
    const recentHits = hits.filter(timestamp => timestamp > oneHourAgo);

    this.hits.set(endpoint, recentHits);

    // Alert if approaching limit
    if (recentHits.length > 80) { // 80% of limit
      console.warn(`Rate limit warning for ${endpoint}: ${recentHits.length}/100 requests`);
    }
  }

  getStats(endpoint: string) {
    const hits = this.hits.get(endpoint) || [];
    return {
      total: hits.length,
      inLastHour: hits.length,
    };
  }
}

// Usage in API route
const monitor = new RateLimitMonitor();

// After each request
monitor.recordHit('/api/resources');

// Get stats
const stats = monitor.getStats('/api/resources');
console.log(`Resource API stats:`, stats);
```

## Future Enhancements

Planned features for rate limiting:

1. **API Keys**: Allow clients to use API keys for increased quotas
2. **Tiered Limits**: Different limit tiers based on usage plans
3. **Burst Allowance**: Temporary burst capacity for spiky traffic
4. **Custom Limits**: Configurable limits per API key
5. **Rate Limit Analytics**: Dashboard for monitoring usage

## Support

If you need higher rate limits for your use case:

1. Review your integration for optimization opportunities
2. Implement client-side caching and batching
3. Contact support with your use case details
4. Consider enterprise plans for higher quotas

For questions about rate limiting:
- Email: support@saithavy.com
- Documentation: https://docs.saithavy.com/api/rate-limiting
- Status Page: https://status.saithavy.com
