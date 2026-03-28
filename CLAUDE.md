# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

### Development
```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
```

### Testing
```bash
npm test                # Run all Vitest tests
npm run test:ui         # Run tests with UI
npm run test:coverage   # Run tests with coverage report
```

### Single Test
```bash
# Run specific test file
npx vitest tests/api/contact.test.ts

# Run tests matching pattern
npx vitest --grep "contact form"
```

### Bundle Analysis
```bash
npm run analyze         # Analyze bundle sizes
npm run analyze:server  # Analyze server bundle
npm run analyze:browser # Analyze client bundle
```

## Architecture

### Clean Architecture Layers

This project uses Domain-Driven Design with hexagonal architecture:

```
src/
├── domain/              # Core business logic (no external dependencies)
│   ├── entities/        # Business entities (e.g., Contact)
│   └── interfaces/      # Contracts for external services (IRepository, IService)
├── adapters/            # External service implementations
│   └── gateways/        # Infrastructure adapters (UpstashRateLimiterAdapter)
├── use_cases/           # Business logic orchestration (SubmitContactUseCase)
├── lib/                 # Utilities and shared code
└── app/                 # Next.js App Router (presentation layer)
```

**Key Principles:**
- Domain interfaces define contracts (e.g., `IRateLimiter`, `IContactRepository`)
- Adapters implement interfaces for external services
- Use cases orchestrate business logic
- API routes use use cases, never call adapters directly

### Security Architecture

**Middleware Chain** (`src/middleware.ts`):
1. Request size validation (1MB max)
2. Authentication check for protected paths
3. CORS origin validation
4. CORS preflight handling
5. Security headers injection

**Security Libraries** (`src/lib/`):
- `crypto-utils.ts` - SHA-256 hashing, salt generation, constant-time comparison
- `security-headers.ts` - CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- `cors-utils.ts` - Origin allowlist with environment-based configuration
- `xss-prevention.ts` - HTML sanitization utilities
- `api-error-handler.ts` - Centralized error handling with specialized functions

**Security Headers Applied:**
- Content-Security-Policy (strict)
- X-Frame-Options (DENY)
- X-Content-Type-Options (nosniff)
- Referrer-Policy (strict-origin-when-cross-origin)
- Permissions-Policy (geolocation=(), microphone=())

### Rate Limiting

**Implementation**: Upstash Redis with adapter pattern

**Flow:**
1. API route calls `UpstashRateLimiterAdapter.checkLimit(identifier)`
2. Adapter implements `IRateLimiter` interface from domain
3. Returns `{ success, limit, remaining, reset, retryAfter }`
4. If disabled (no env vars), allows all requests

**Configuration**: 5 submissions per hour per IP (configurable in `src/lib/ratelimit.ts`)

### Form Validation

**Shared Zod Schemas** (`src/lib/validators.ts`):
- Schemas defined once, used client and server
- All API routes validate input with Zod before processing
- Includes honeypot field for spam detection

**Example:**
```typescript
import { contactSchema } from "@/lib/validators";
const validated = contactSchema.parse(requestBody);
```

### API Routes

**Route Handler Pattern:**
```typescript
// 1. Validate input with Zod
// 2. Check rate limit
// 3. Call use case
// 4. Handle errors with apiErrorHandler
// 5. Return typed response
```

**Edge Functions** (`src/app/api/edge/`):
- Run on Edge Runtime (fast, lightweight)
- Handle their own CORS (skip middleware)
- Used for health checks, geo-lookup, analytics

### ISR Caching

**Resources Page** uses Incremental Static Regeneration:
- Content cached at build time
- Revalidated on-demand (stale-while-revalidate)
- See `src/lib/resourceContent.ts` for implementation

### Component Optimization

**Performance Patterns:**
- `React.memo` for expensive components
- `useCallback` for event handlers
- `useMemo` for computed values
- Dynamic imports for large libraries (p5.js in HeroSection)

**Example:**
```typescript
export const ResourceCard = React.memo(({ resource }) => {
  const handleClick = useCallback(() => { ... }, [resource.id]);
  const formattedDate = useMemo(() => formatDate(resource.date), [resource.date]);
  return <div onClick={handleClick}>{formattedDate}</div>;
});
```

### Testing Setup

**Vitest Configuration** (`vitest.config.ts`):
- Environment: jsdom
- Path alias: `@/` → `src/`
- Coverage provider: v8
- Test location: `tests/` directory

**Test Patterns:**
```typescript
// API endpoint test
import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/contact/route';

// Utility test
import { hashPassword } from '@/lib/crypto-utils';

// Edge function test (requires Edge Runtime)
import { GET } from '@/app/api/edge/health/route';
```

## Environment Variables

**Required** (`.env.local`):
```env
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
```

**Optional** (for production):
```env
ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

## Dependency Injection

The app uses constructor injection for use cases:

```typescript
// In API route
const repository = new LoggerContactRepository(); // adapter
const useCase = new SubmitContactUseCase(repository); // use case
await useCase.execute(contactData);
```

## File Organization Rules

**Where to put code:**
- `/src` - All source code
- `/tests` - All test files (mirrors `/src` structure)
- `/docs` - Documentation only (API specs, reports)
- `/scripts` - Utility scripts
- Never save to root folder

## Build Verification

Before committing:
1. `npm run lint` - Must be clean
2. `npm test` - All tests must pass
3. `npm run build` - Must succeed with zero errors

## Important Patterns

**When adding API endpoints:**
1. Create Zod schema in `validators.ts`
2. Add to OpenAPI spec (`docs/api/openapi.yaml`)
3. Add tests in `tests/api/`
4. Use apiErrorHandler for consistent error responses

**When adding components:**
1. Use React.memo for expensive renders
2. Extract callbacks with useCallback
3. Add loading/error states
4. Test with Vitest + Testing Library

**When modifying security:**
1. Run security scan: `npx @claude-flow/cli@latest security scan`
2. Update `docs/SECURITY_AUDIT_REPORT.md`
3. Test CORS headers
4. Verify CSP doesn't break functionality

## Migration Notes

**Recent Migrations (from SPARC code review):**
- Fixed lucide-react wildcard imports (use direct imports)
- Added 225+ test cases for coverage
- Implemented OWASP security controls (7/10 categories)
- Added ISR caching for resources
- Created OpenAPI 3.0 specification

## Bundle Optimization

**Lucide React Icons** - Always import directly:
```typescript
// ✅ Correct
import { Star, ArrowRight } from 'lucide-react';

// ❌ Wrong - bundles entire library
import * as Icons from 'lucide-react';
```

**Dynamic Imports** - For heavy components:
```typescript
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

## Performance Targets

- Page Load: < 2s (3G connection)
- Time to Interactive: < 3s
- First Contentful Paint: < 1.5s
- Bundle Size (gzipped): < 200KB initial

## Key Files to Understand

- `src/middleware.ts` - Request processing pipeline
- `src/lib/validators.ts` - All input schemas
- `src/lib/security-headers.ts` - Security header configuration
- `src/lib/crypto-utils.ts` - Hashing utilities
- `src/adapters/gateways/UpstashRateLimiterAdapter.ts` - Rate limiting adapter
- `src/domain/interfaces/` - Domain contracts
- `vitest.config.ts` - Test configuration
