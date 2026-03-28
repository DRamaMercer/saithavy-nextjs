# API Usage Examples

This document provides practical examples for consuming the Saithavy API endpoints.

## Table of Contents

- [Authentication](#authentication)
- [Resources API](#resources-api)
- [Contact API](#contact-api)
- [Downloads API](#downloads-api)
- [Edge Functions](#edge-functions)
- [Error Handling](#error-handling)

## Authentication

Currently, the API uses rate limiting based on IP address rather than authentication. All endpoints include rate limit headers in their responses.

```typescript
// Rate limit headers are included in all responses
interface RateLimitHeaders {
  'X-RateLimit-Limit': string;      // Total requests allowed
  'X-RateLimit-Remaining': string;  // Requests remaining in window
  'X-RateLimit-Reset': string;      // Unix timestamp when limit resets
}
```

## Resources API

### List All Resources with Pagination

```typescript
const response = await fetch('https://saithavy.com/api/resources?page=1&limit=12');
const data = await response.json();

// Response structure
interface ResourceListResponse {
  resources: Resource[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  categories: Category[];
}

console.log(`Page ${data.currentPage} of ${data.totalPages}`);
console.log(`Total resources: ${data.totalCount}`);
```

### Filter by Category

```typescript
// Get mindful leadership resources
const response = await fetch('https://saithavy.com/api/resources?category=mindful-leadership');
const data = await response.json();

data.resources.forEach(resource => {
  console.log(`${resource.title} - ${resource.description}`);
});
```

### Search Resources

```typescript
// Search for leadership resources
const query = encodeURIComponent('leadership');
const response = await fetch(`https://saithavy.com/api/resources?q=${query}`);
const data = await response.json();

console.log(`Found ${data.totalCount} resources matching "leadership"`);
```

### Sort by Popularity

```typescript
// Get most popular resources
const response = await fetch('https://saithavy.com/api/resources?sort=popular&limit=10');
const data = await response.json();

data.resources.forEach(resource => {
  console.log(`${resource.title}: ${resource.downloads} downloads`);
});
```

### Filter by Type and Tags

```typescript
// Get all guide-type resources with productivity tag
const response = await fetch('https://saithavy.com/api/resources?type=guide&tags=productivity');
const data = await response.json();
```

## Contact API

### Submit Contact Form

```typescript
interface ContactRequest {
  email: string;
  name: string;
  message: string;
}

async function submitContactForm(data: ContactRequest) {
  const response = await fetch('https://saithavy.com/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    if (response.status === 429) {
      // Rate limit exceeded
      console.error(`Rate limit exceeded. Retry after ${error.retryAfter} seconds`);
    } else if (response.status === 400) {
      // Validation error
      console.error('Validation errors:', error.issues);
    }

    throw new Error(error.error || 'Submission failed');
  }

  const result = await response.json();
  console.log(result.message); // "Thank you! Your message has been received."

  // Check rate limit status
  const rateLimit = {
    limit: response.headers.get('X-RateLimit-Limit'),
    remaining: response.headers.get('X-RateLimit-Remaining'),
    reset: response.headers.get('X-RateLimit-Reset'),
  };

  console.log(`Rate limit: ${rateLimit.remaining}/${rateLimit.limit} requests remaining`);

  return result;
}

// Usage
await submitContactForm({
  email: 'user@example.com',
  name: 'John Doe',
  message: 'I would like to learn more about your leadership programs.',
});
```

## Downloads API

### Request PDF Download

```typescript
interface DownloadRequest {
  email: string;
  resourceId: string;
  format: 'pdf' | 'web' | 'print';
  firstName?: string;
}

async function requestDownload(data: DownloadRequest) {
  const response = await fetch('https://saithavy.com/api/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();

    if (response.status === 429) {
      console.error(`Too many downloads. Retry after ${error.retryAfter} seconds`);
    }

    throw new Error(error.error || 'Download request failed');
  }

  const result = await response.json();
  console.log(`Download started: ${result.downloadUrl}`);

  return result;
}

// Usage
await requestDownload({
  email: 'user@example.com',
  resourceId: '1',
  format: 'pdf',
  firstName: 'John',
});
```

### Generate PDF for Resource

```typescript
async function generateResourcePDF(resourceId: string) {
  const response = await fetch('https://saithavy.com/api/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resourceId }),
  });

  if (!response.ok) {
    throw new Error('PDF generation failed');
  }

  const result = await response.json();

  // Currently returns HTML for printing
  // TODO: Integrate with puppeteer for actual PDF generation
  console.log('PDF HTML generated:', result.html);

  return result;
}
```

## Edge Functions

### Health Check

```typescript
async function checkHealth() {
  const response = await fetch('https://saithavy.com/api/edge/health');
  const data = await response.json();

  console.log('System status:', data.status);

  // Check individual services
  Object.entries(data.checks).forEach(([service, check]: [string, any]) => {
    console.log(`${service}: ${check.status} (${check.latency}ms)`);
  });

  return data;
}

// Usage
const health = await checkHealth();

if (health.status === 'healthy') {
  console.log('All systems operational');
} else if (health.status === 'degraded') {
  console.warn('Some services degraded');
} else {
  console.error('System unhealthy');
}
```

### Geolocation Lookup

```typescript
async function getGeolocation() {
  const response = await fetch('https://saithavy.com/api/edge/geo-lookup');
  const data = await response.json();

  console.log(`IP: ${data.ip}`);
  console.log(`Location: ${data.geo.city}, ${data.geo.region}, ${data.geo.country}`);

  return data;
}
```

### Get Localized Content

```typescript
async function getLocalizedContent() {
  const response = await fetch('https://saithavy.com/api/edge/geo-content');
  const data = await response.json();

  console.log(`Country: ${data.country}`);
  console.log(`Language: ${data.language}`);
  console.log(`Currency: ${data.currency}`);
  console.log(`Message: ${data.message}`);

  return data;
}
```

### Track Analytics Event

```typescript
interface AnalyticsEvent {
  name: string;
  category?: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  url: string;
  userAgent: string;
}

async function trackEvent(event: AnalyticsEvent) {
  const response = await fetch('https://saithavy.com/api/edge/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (response.status === 202) {
    console.log('Event tracked successfully');
  }
}

// Usage
await trackEvent({
  name: 'resource_download',
  category: 'conversion',
  label: 'Mindful Leadership Journal',
  value: 1,
  properties: {
    resourceId: '1',
    format: 'pdf',
  },
  url: window.location.href,
  userAgent: navigator.userAgent,
});
```

### Proxy External API

```typescript
async function proxyBlogPosts() {
  const response = await fetch('https://saithavy.com/api/edge/proxy?type=blog');
  const data = await response.json();

  console.log('Blog posts:', data);

  return data;
}

async function proxyUser(userId: string) {
  const response = await fetch(`https://saithavy.com/api/edge/proxy?type=user&path=/${userId}`);
  const data = await response.json();

  console.log('User data:', data);

  return data;
}
```

### Get Available Resources by Region

```typescript
async function getAvailableResources() {
  const response = await fetch('https://saithavy.com/api/edge/resources');
  const data = await response.json();

  console.log(`Resources available in ${data.country}: ${data.total}`);
  console.log(`Restricted resources: ${data.restricted}`);

  return data;
}
```

## Error Handling

### Centralized Error Handler

```typescript
class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI(url: string, options?: RequestInit) {
  const response = await fetch(url, options);

  // Check for rate limit errors
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const resetTime = response.headers.get('X-RateLimit-Reset');

    throw new APIError(
      429,
      'Rate limit exceeded',
      { retryAfter: retryAfter || resetTime }
    );
  }

  // Check for other errors
  if (!response.ok) {
    const error = await response.json();
    throw new APIError(response.status, error.error || 'Request failed', error);
  }

  return response.json();
}

// Usage with error handling
try {
  const data = await fetchAPI('https://saithavy.com/api/resources');
  console.log(data);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error ${error.status}: ${error.message}`);

    if (error.status === 429) {
      const retryAfter = error.details?.retryAfter;
      console.log(`Retry after ${retryAfter} seconds`);
    }
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Retry Logic with Exponential Backoff

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry on 4xx errors (client errors)
      if (response.status >= 400 && response.status < 500) {
        const error = await response.json();
        throw new APIError(response.status, error.error || 'Client error');
      }

      // Retry on 5xx errors or rate limiting
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Don't retry if max attempts reached
      if (attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
const data = await fetchWithRetry('https://saithavy.com/api/resources');
```

## React Integration Example

```typescript
import { useState, useEffect } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  downloads: number;
}

export function useResources(category?: string) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setError(null);

        const url = category
          ? `https://saithavy.com/api/resources?category=${category}`
          : 'https://saithavy.com/api/resources';

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        setResources(data.resources);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [category]);

  return { resources, loading, error };
}

// Usage in component
function ResourcesList() {
  const { resources, loading, error } = useResources('mindful-leadership');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {resources.map(resource => (
        <li key={resource.id}>
          <h3>{resource.title}</h3>
          <p>{resource.description}</p>
          <small>{resource.downloads} downloads</small>
        </li>
      ))}
    </ul>
  );
}
```

## Testing with cURL

### Get resources

```bash
curl -X GET "https://saithavy.com/api/resources?page=1&limit=12"
```

### Submit contact form

```bash
curl -X POST "https://saithavy.com/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "name": "John Doe",
    "message": "I would like to learn more about your programs."
  }'
```

### Request download

```bash
curl -X POST "https://saithavy.com/api/download" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "resourceId": "1",
    "format": "pdf",
    "firstName": "John"
  }'
```

### Health check

```bash
curl -X GET "https://saithavy.com/api/edge/health"
```

### Track analytics event

```bash
curl -X POST "https://saithavy.com/api/edge/analytics" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "page_view",
    "category": "engagement",
    "label": "Resources Page",
    "value": 1,
    "url": "https://saithavy.com/resources",
    "userAgent": "Mozilla/5.0..."
  }'
```
