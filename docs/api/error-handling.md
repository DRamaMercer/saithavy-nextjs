# API Error Handling

## Overview

The Saithavy API uses standard HTTP status codes and follows RESTful error response conventions. This document describes all possible errors and how to handle them.

## HTTP Status Codes

### Successful Responses (2xx)

| Status | Description | Usage |
|--------|-------------|-------|
| `200 OK` | Request succeeded | Standard successful response |
| `202 Accepted` | Request accepted for processing | Analytics events, async operations |

### Client Errors (4xx)

| Status | Description | Usage |
|--------|-------------|-------|
| `400 Bad Request` | Invalid request parameters | Validation errors, malformed JSON |
| `404 Not Found` | Resource not found | Invalid resource ID or slug |
| `429 Too Many Requests` | Rate limit exceeded | Too many requests in time window |

### Server Errors (5xx)

| Status | Description | Usage |
|--------|-------------|-------|
| `500 Internal Server Error` | Unexpected server error | Unhandled exceptions |
| `502 Bad Gateway` | Upstream service error | Proxy failures |
| `503 Service Unavailable` | Service temporarily unavailable | Health check failures |

## Error Response Format

### Standard Error Response

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong",
  "issues": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Validation Errors (400)

When request validation fails:

```json
{
  "error": "Validation failed",
  "issues": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "message",
      "message": "Message must be at least 10 characters"
    }
  ]
}
```

### Not Found Errors (404)

When a resource is not found:

```json
{
  "error": "Resource not found"
}
```

### Rate Limit Errors (429)

When rate limit is exceeded:

```json
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 3600
}
```

**Headers included:**
```http
Retry-After: 3600
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1711641600
```

### Server Errors (500)

When an unexpected error occurs:

```json
{
  "error": "An unexpected error occurred. Please try again."
}
```

## Endpoint-Specific Errors

### `/api/contact`

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Validation failed | Invalid email, name, or message |
| 429 | Too many contact form submissions | Exceeded 3 submissions per hour |
| 500 | Unexpected error | Server-side processing error |

**Example validation error:**
```json
{
  "error": "Validation failed",
  "issues": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    },
    {
      "field": "name",
      "message": "Name must be at least 2 characters"
    },
    {
      "field": "message",
      "message": "Message must be at least 10 characters"
    }
  ]
}
```

### `/api/download`

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Invalid request data | Missing required fields or invalid values |
| 404 | Resource not found | Invalid resource ID |
| 429 | Too many download attempts | Exceeded 5 downloads per hour |
| 500 | Unexpected error | Server-side processing error |

**Example validation error:**
```json
{
  "error": "Invalid request data",
  "issues": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    },
    {
      "field": "resourceId",
      "message": "Resource ID is required"
    }
  ]
}
```

### `/api/resources`

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Invalid query parameters | Invalid category, type, or sort value |
| 500 | Failed to fetch resources | Server-side processing error |

**Example error:**
```json
{
  "error": "Invalid query parameter",
  "issues": [
    {
      "field": "sort",
      "message": "Sort must be one of: newest, popular, relevance"
    }
  ]
}
```

### `/api/pdf`

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Missing required field | `resourceId` not provided |
| 404 | Resource not found | Invalid resource ID |
| 500 | Failed to generate PDF | Server-side processing error |

### `/api/edge/health`

| Status | Description |
|--------|-------------|
| 200 | System is healthy or degraded |
| 503 | System is unhealthy (one or more checks failed) |

**Degraded response:**
```json
{
  "status": "degraded",
  "checks": {
    "edge": { "status": "pass" },
    "cache": { "status": "degraded", "latency": 150 },
    "database": { "status": "pass" },
    "redis": { "status": "pass" }
  },
  "metadata": {
    "responseTime": "150ms",
    "timestamp": "2026-03-28T12:00:00.000Z"
  }
}
```

**Unhealthy response:**
```json
{
  "status": "unhealthy",
  "checks": {
    "edge": { "status": "pass" },
    "cache": { "status": "fail", "error": "Connection timeout" },
    "database": { "status": "pass" },
    "redis": { "status": "fail", "error": "Connection refused" }
  },
  "metadata": {
    "responseTime": "50ms",
    "timestamp": "2026-03-28T12:00:00.000Z"
  }
}
```

## Error Handling Strategies

### 1. Centralized Error Handler

Create a reusable error handler for all API calls:

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

async function handleAPIResponse(response: Response): Promise<any> {
  // Check for rate limit errors
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    const resetTime = response.headers.get('X-RateLimit-Reset');

    throw new APIError(
      429,
      'Rate limit exceeded',
      {
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
        resetAt: resetTime ? new Date(parseInt(resetTime) * 1000) : undefined
      }
    );
  }

  // Check for client errors
  if (response.status >= 400 && response.status < 500) {
    const error = await response.json();

    throw new APIError(
      response.status,
      error.error || 'Client error',
      error.issues || []
    );
  }

  // Check for server errors
  if (response.status >= 500) {
    const error = await response.json();

    throw new APIError(
      response.status,
      error.error || 'Server error'
    );
  }

  // Success - parse JSON
  return response.json();
}

// Usage
try {
  const response = await fetch('/api/resources');
  const data = await handleAPIResponse(response);
  console.log(data);
} catch (error) {
  if (error instanceof APIError) {
    console.error(`API Error ${error.status}: ${error.message}`);

    if (error.status === 429) {
      console.log(`Retry after: ${error.details.retryAfter} seconds`);
    } else if (error.status === 400) {
      console.log('Validation issues:', error.details);
    }
  }
}
```

### 2. Retry Strategy

Implement retry logic for transient errors:

```typescript
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return await handleAPIResponse(response);
      }

      // Retry on server errors (5xx) or rate limiting (429)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await handleAPIResponse(response);
    } catch (error) {
      // Last attempt - throw error
      if (attempt === maxRetries) {
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.pow(2, attempt) * 1000;

      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
const data = await fetchWithRetry('/api/resources');
```

### 3. User-Friendly Error Messages

Convert technical errors to user-friendly messages:

```typescript
function getUserFriendlyError(error: APIError): string {
  switch (error.status) {
    case 400:
      if (error.details?.issues) {
        const issues = error.details.issues
          .map((issue: any) => issue.message)
          .join(', ');
        return `Please check your input: ${issues}`;
      }
      return 'Invalid request. Please check your input and try again.';

    case 404:
      return 'The requested resource was not found.';

    case 429:
      const retryAfter = error.details?.retryAfter;
      if (retryAfter) {
        const minutes = Math.ceil(retryAfter / 60);
        return `You've made too many requests. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
      }
      return 'You\'ve made too many requests. Please try again later.';

    case 500:
    case 502:
    case 503:
      return 'A server error occurred. Please try again later.';

    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

// Usage in UI
try {
  await submitContactForm(formData);
} catch (error) {
  if (error instanceof APIError) {
    setErrorMessage(getUserFriendlyError(error));
  }
}
```

### 4. Error Logging

Log errors for debugging and monitoring:

```typescript
interface ErrorLog {
  timestamp: Date;
  endpoint: string;
  status: number;
  message: string;
  details?: any;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];

  log(endpoint: string, error: APIError) {
    const log: ErrorLog = {
      timestamp: new Date(),
      endpoint,
      status: error.status,
      message: error.message,
      details: error.details,
    };

    this.logs.push(log);

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[API Error]', log);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorTracking(log);
    }
  }

  private async sendToErrorTracking(log: ErrorLog) {
    // Send to Sentry, LogRocket, etc.
    // Example: Sentry.captureException(log);
  }

  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

// Usage
const logger = new ErrorLogger();

try {
  const data = await fetchAPI('/api/resources');
} catch (error) {
  if (error instanceof APIError) {
    logger.log('/api/resources', error);
  }
}
```

### 5. React Integration

Handle errors in React components:

```typescript
import { useState, useEffect } from 'react';

interface UseAPIResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

function useAPI<T>(url: string): UseAPIResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);
      const result = await handleAPIResponse(response);

      setData(result);
    } catch (err) {
      if (err instanceof APIError) {
        setError(getUserFriendlyError(err));
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
}

// Usage in component
function ResourcesList() {
  const { data, loading, error, refetch } = useAPI<Resource[]>('/api/resources');

  if (loading) return <div>Loading...</div>;

  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <ul>
      {data?.map(resource => (
        <li key={resource.id}>{resource.title}</li>
      ))}
    </ul>
  );
}
```

## Testing Error Handling

### Test Different Error Scenarios

```typescript
// Test rate limit handling
async function testRateLimit() {
  const promises = Array(150).fill(null).map(() =>
    fetch('/api/resources')
  );

  const responses = await Promise.all(promises);

  const rateLimited = responses.filter(r => r.status === 429);
  console.log(`Rate limited responses: ${rateLimited.length}`);
}

// Test validation errors
async function testValidation() {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'invalid-email',
      name: 'A',
      message: 'Short',
    }),
  });

  const error = await response.json();
  console.log('Validation errors:', error.issues);
}

// Test not found errors
async function testNotFound() {
  const response = await fetch('/api/resources/nonexistent-slug');
  console.log('Status:', response.status);
}
```

## Monitoring and Alerting

### Track Error Rates

```typescript
class ErrorMonitor {
  private errorCounts: Map<number, number> = new Map();

  recordError(status: number) {
    const count = this.errorCounts.get(status) || 0;
    this.errorCounts.set(status, count + 1);

    // Alert on high error rates
    if (status >= 500) {
      const serverErrors = this.errorCounts.get(500) || 0;
      if (serverErrors > 10) {
        console.error('High server error rate detected!');
        // Send alert to monitoring service
      }
    }
  }

  getErrorRates() {
    const total = Array.from(this.errorCounts.values()).reduce((a, b) => a + b, 0);

    return {
      total,
      byStatus: Object.fromEntries(this.errorCounts),
    };
  }
}

// Usage
const monitor = new ErrorMonitor();

try {
  await fetchAPI('/api/resources');
} catch (error) {
  if (error instanceof APIError) {
    monitor.recordError(error.status);
  }
}

// Get error rates
const rates = monitor.getErrorRates();
console.log('Error rates:', rates);
```

## Best Practices

1. **Always handle errors**: Never assume requests will succeed
2. **Provide user feedback**: Show clear error messages to users
3. **Log errors**: Track errors for debugging and monitoring
4. **Retry transient failures**: Implement retry logic for 5xx errors
5. **Respect rate limits**: Handle 429 errors gracefully
6. **Validate input**: Check request data before sending
7. **Monitor error rates**: Track and alert on high error rates
8. **Test error scenarios**: Verify error handling works correctly

## Support

For help with error handling:

- Documentation: https://docs.saithavy.com/api/errors
- Support: support@saithavy.com
- Status Page: https://status.saithavy.com
