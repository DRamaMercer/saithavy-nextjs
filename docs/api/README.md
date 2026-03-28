# Saithavy API Documentation

Comprehensive API documentation for the Saithavy mindful leadership and remote work resources platform.

## Quick Links

- [OpenAPI Specification](./openapi.yaml) - Complete API specification in OpenAPI 3.0 format
- [Usage Examples](./usage-examples.md) - Practical code examples for all endpoints
- [Rate Limiting](./rate-limiting.md) - Rate limiting strategy and best practices
- [Error Handling](./error-handling.md) - Error codes and handling strategies

## Getting Started

### Base URL

```
Production: https://saithavy.com
Staging: https://staging.saithavy.com
Local: http://localhost:3000
```

### Quick Example

```typescript
// Fetch all resources
const response = await fetch('https://saithavy.com/api/resources');
const data = await response.json();

console.log(data.resources); // Array of resources
console.log(data.totalCount); // Total number of resources
```

## API Overview

The Saithavy API provides endpoints for:

- **Resources**: Browse and search mindfulness and remote work resources
- **Contact**: Submit contact forms and support requests
- **Downloads**: Request resource downloads with lead capture
- **Edge Functions**: Geo-location, analytics, and health checks

### Available Endpoints

#### Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources` | List all resources with filtering and pagination |
| GET | `/api/categories` | List all categories with resource counts |

#### Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |

#### Downloads

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/download` | Request resource download |
| POST | `/api/pdf` | Generate PDF for resource |

#### Edge Functions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/edge/health` | System health check |
| GET | `/api/edge/geo-lookup` | Get client geolocation |
| GET | `/api/edge/geo-content` | Get localized content |
| GET | `/api/edge/proxy` | Proxy external APIs |
| GET | `/api/edge/resources` | Get available resources by region |
| POST | `/api/edge/analytics` | Track analytics events |

## Authentication

Currently, the API uses IP-based rate limiting rather than authentication. All requests include rate limit headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1711641600
```

Future versions will support API keys for increased quotas and enhanced tracking.

## Rate Limiting

Rate limits are enforced per IP address and vary by endpoint:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `GET /api/resources` | 100 requests | 5 minutes |
| `POST /api/contact` | 3 requests | 1 hour |
| `POST /api/download` | 5 requests | 1 hour |
| `POST /api/edge/analytics` | 50 requests | 1 minute |

See [Rate Limiting Documentation](./rate-limiting.md) for detailed information and best practices.

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "Error message",
  "issues": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

See [Error Handling Documentation](./error-handling.md) for comprehensive error information.

## Common Use Cases

### List Resources with Pagination

```typescript
const response = await fetch('https://saithavy.com/api/resources?page=1&limit=12');
const data = await response.json();

console.log(`Page ${data.currentPage} of ${data.totalPages}`);
data.resources.forEach(resource => {
  console.log(resource.title);
});
```

### Search Resources

```typescript
const query = encodeURIComponent('leadership');
const response = await fetch(`https://saithavy.com/api/resources?q=${query}`);
const data = await response.json();
```

### Submit Contact Form

```typescript
const response = await fetch('https://saithavy.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    message: 'I would like to learn more about your programs.'
  })
});

const result = await response.json();
```

### Request Download

```typescript
const response = await fetch('https://saithavy.com/api/download', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    resourceId: '1',
    format: 'pdf',
    firstName: 'John'
  })
});

const result = await response.json();
console.log(result.downloadUrl);
```

### Health Check

```typescript
const response = await fetch('https://saithavy.com/api/edge/health');
const health = await response.json();

console.log('System status:', health.status);
```

## SDK Examples

### JavaScript/TypeScript

```typescript
class SaithavyClient {
  constructor(private baseUrl = 'https://saithavy.com') {}

  async getResources(params?: {
    category?: string;
    page?: number;
    limit?: number;
    type?: string;
    sort?: 'newest' | 'popular' | 'relevance';
    q?: string;
  }) {
    const searchParams = new URLSearchParams(params as any);
    const response = await fetch(`${this.baseUrl}/api/resources?${searchParams}`);
    return response.json();
  }

  async submitContact(data: {
    email: string;
    name: string;
    message: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async requestDownload(data: {
    email: string;
    resourceId: string;
    format: 'pdf' | 'web' | 'print';
    firstName?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// Usage
const client = new SaithavyClient();
const resources = await client.getResources({ category: 'mindful-leadership' });
```

### React Hook

```typescript
import { useState, useEffect } from 'react';

function useResources(category?: string) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const url = category
          ? `https://saithavy.com/api/resources?category=${category}`
          : 'https://saithavy.com/api/resources';
        const response = await fetch(url);
        const data = await response.json();
        setResources(data.resources);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, [category]);

  return { resources, loading, error };
}
```

### Python

```python
import requests

class SaithavyClient:
    def __init__(self, base_url='https://saithavy.com'):
        self.base_url = base_url

    def get_resources(self, **params):
        response = requests.get(f'{self.base_url}/api/resources', params=params)
        response.raise_for_status()
        return response.json()

    def submit_contact(self, email, name, message):
        response = requests.post(
            f'{self.base_url}/api/contact',
            json={'email': email, 'name': name, 'message': message}
        )
        response.raise_for_status()
        return response.json()

    def request_download(self, email, resource_id, format='pdf', first_name=None):
        data = {
            'email': email,
            'resourceId': resource_id,
            'format': format
        }
        if first_name:
            data['firstName'] = first_name

        response = requests.post(
            f'{self.base_url}/api/download',
            json=data
        )
        response.raise_for_status()
        return response.json()

# Usage
client = SaithavyClient()
resources = client.get_resources(category='mindful-leadership')
print(resources['resources'])
```

## Testing

### Test with cURL

```bash
# Get resources
curl -X GET "https://saithavy.com/api/resources?page=1&limit=12"

# Submit contact form
curl -X POST "https://saithavy.com/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe","message":"Test message"}'

# Request download
curl -X POST "https://saithavy.com/api/download" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","resourceId":"1","format":"pdf"}'

# Health check
curl -X GET "https://saithavy.com/api/edge/health"
```

### Test with Postman

1. Import the OpenAPI specification into Postman
2. Use the provided environments for staging/production
3. Set up test scripts for automated testing

## OpenAPI Specification

The complete API specification is available in [OpenAPI 3.0 format](./openapi.yaml). You can:

- View it in Swagger UI or Redoc
- Import it into Postman or Insomnia
- Generate client SDKs using OpenAPI Generator
- Validate requests against the schema

### Generate Client SDKs

```bash
# Using OpenAPI Generator
npx @openapitools/openapi-generator-cli generate \
  -i docs/api/openapi.yaml \
  -g typescript-axios \
  -o ./sdk/typescript

# Generate Python SDK
npx @openapitools/openapi-generator-cli generate \
  -i docs/api/openapi.yaml \
  -g python \
  -o ./sdk/python
```

## Best Practices

1. **Handle Errors Gracefully**: Always implement proper error handling
2. **Respect Rate Limits**: Monitor rate limit headers and implement backoff
3. **Cache Responses**: Use appropriate caching strategies to reduce load
4. **Use Pagination**: Don't fetch all resources at once
5. **Validate Input**: Check request data before sending
6. **Monitor Performance**: Track API response times and error rates
7. **Test Thoroughly**: Test both success and error scenarios

## Support

### Documentation

- API Reference: [OpenAPI Specification](./openapi.yaml)
- Usage Examples: [Usage Examples](./usage-examples.md)
- Rate Limiting: [Rate Limiting Guide](./rate-limiting.md)
- Error Handling: [Error Handling Guide](./error-handling.md)

### Contact

- Email: support@saithavy.com
- Documentation: https://docs.saithavy.com
- Status Page: https://status.saithavy.com
- GitHub Issues: https://github.com/saithavy/saithavy-nextjs/issues

### Changelog

- **v1.0.0** (2026-03-28): Initial API release
  - Resources endpoints
  - Contact form submission
  - Download management
  - Edge functions for geo-location and analytics
  - Health monitoring

## License

MIT License - See LICENSE file for details

---

**Last Updated**: 2026-03-28
**API Version**: 1.0.0
