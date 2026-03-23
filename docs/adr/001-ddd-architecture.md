# ADR-001: Domain-Driven Design Architecture

**Status**: Accepted
**Date**: 2025-01-16
**Decision Makers**: Development Team

## Context

The Saithavy website requires clean separation of concerns to:
- Test business logic independently of frameworks
- Swap external service implementations (e.g., rate limiters)
- Maintain codebase as complexity grows
- Follow industry best practices for enterprise architecture

## Decision

Implement **Domain-Driven Design (DDD)** layering architecture with clear separation between:
1. **Domain Layer**: Business entities and interfaces
2. **Application Layer**: Use cases and orchestration
3. **Infrastructure Layer**: External service adapters
4. **Presentation Layer**: UI and API routes

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│                   (Next.js App Router)                       │
│  - Pages (Server Components)                                 │
│  - API Routes (HTTP handlers)                                │
│  - React Components (Client Components)                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│                      (Use Cases)                             │
│  - SubmitContactUseCase                                      │
│  - DownloadResourceUseCase                                   │
│  - Business logic orchestration                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      DOMAIN LAYER                            │
│              (Entities, Interfaces, Value Objects)           │
│  - Contact (Entity)                                          │
│  - IContactRepository (Interface)                            │
│  - IRateLimiter (Interface)                                  │
│  - Business rules and invariants                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                         │
│              (Adapters, Gateways, Implementations)           │
│  - UpstashRateLimiterAdapter                                 │
│  - LoggerContactRepository                                   │
│  - DI Container                                               │
└─────────────────────────────────────────────────────────────┘
```

### Example Implementation

**Domain Layer** (Interfaces):
```typescript
// src/domain/interfaces/IRateLimiter.ts
export interface IRateLimiter {
  checkLimit(ip: string): Promise<RateLimitResult>;
}
```

**Application Layer** (Use Case):
```typescript
// src/use_cases/SubmitContactUseCase.ts
export class SubmitContactUseCase {
  constructor(
    private rateLimiter: IRateLimiter,
    private contactRepository: IContactRepository
  ) {}

  async execute(request: SubmitContactRequest): Promise<SubmitContactResponse> {
    // Business logic orchestration
    const rateLimit = await this.rateLimiter.checkLimit(request.ip);
    // ...
  }
}
```

**Infrastructure Layer** (Adapter):
```typescript
// src/adapters/gateways/UpstashRateLimiterAdapter.ts
export class UpstashRateLimiterAdapter implements IRateLimiter {
  async checkLimit(ip: string): Promise<RateLimitResult> {
    // Upstash-specific implementation
  }
}
```

## Alternatives Considered

### 1. Traditional MVC (Rejected)

**Pros**: Simpler, less boilerplate
**Cons**: Tight coupling, hard to test, business logic in controllers

**Rationale**: MVC is suitable for simple CRUD apps but lacks separation for complex business logic.

### 2. Layered Architecture without DDD (Rejected)

**Pros**: Familiar pattern
**Cons**: Still allows domain logic to leak into presentation

**Rationale**: DDD provides explicit boundaries and ubiquitous language.

### 3. Microservices (Rejected)

**Pros**: Scalability, independent deployments
**Cons**: Over-engineering for a personal website, operational complexity

**Rationale**: The site doesn't require the complexity of distributed systems.

## Consequences

### Positive

- ✅ **Testability**: Business logic can be tested without Next.js framework
- ✅ **Flexibility**: External services can be swapped via DI container
- ✅ **Maintainability**: Clear boundaries make code easier to understand
- ✅ **Scalability**: Architecture can grow with application complexity
- ✅ **Domain Language**: Ubiquitous language in code matches business concepts

### Negative

- ⚠️ **Boilerplate**: More files and interfaces than simple architecture
- ⚠️ **Learning Curve**: Team must understand DDD concepts
- ⚠️ **Indirection**: More layers to navigate for simple features
- ⚠️ **Overhead**: Initial setup takes longer than simpler approaches

## Validation

The DDD architecture has been validated through:
1. **Unit Tests**: Business logic tested in isolation
2. **Integration**: Rate limiter swapped from in-memory to Upstash
3. **Code Review**: Architecture approved by senior developers
4. **Performance**: No performance degradation from layering

## Related Decisions

- [ADR-002: Custom Dependency Injection Container](./002-custom-di-container.md)
- [ADR-003: Next.js 16 App Router](./003-nextjs-app-router.md)

## References

- [Domain-Driven Design Reference](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [DDD in TypeScript](https://khalilstemmler.com/articles/typescript-ddd)
