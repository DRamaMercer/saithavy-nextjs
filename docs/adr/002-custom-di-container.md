# ADR-002: Custom Dependency Injection Container

**Status**: Accepted
**Date**: 2025-01-16
**Decision Makers**: Development Team

## Context

The DDD architecture requires dependency injection to:
- Decouple domain layer from infrastructure implementations
- Enable testing with mock implementations
- Provide singleton lifecycle for services
- Detect circular dependencies at runtime

## Decision

Build a **lightweight custom DI container** instead of using existing frameworks.

### Requirements

1. **Type-safe resolution**: TypeScript must infer correct types
2. **Singleton lifecycle**: Single instance for the application lifetime
3. **Transient lifecycle**: New instance on each resolution
4. **Circular dependency detection**: Throw error on circular deps
5. **Async and sync resolution**: Support both factory types
6. **Minimal bundle size**: <5KB gzipped

### Implementation

```typescript
// src/lib/di/Container.ts
export class DIContainer {
  private services = new Map<ServiceKey, ServiceDescriptor<unknown>>();

  register<T>(key: ServiceKey, factory: ServiceFactory<T>, lifetime: ServiceLifetime = 'singleton'): void {
    // Registration logic
  }

  async resolve<T>(key: ServiceKey): Promise<T> {
    // Async resolution with singleton caching
  }

  resolveSync<T>(key: ServiceKey): T {
    // Sync resolution for non-async factories
  }
}
```

### Service Registration

```typescript
// src/lib/di/services.ts
export function registerServices(container: DIContainer): void {
  container.register(
    ServiceKeys.RateLimiter,
    () => new UpstashRateLimiterAdapter(),
    'singleton'
  );

  container.register(
    ServiceKeys.ContactRepository,
    () => new LoggerContactRepository(),
    'singleton'
  );
}
```

### Service Resolution

```typescript
// In API routes
const rateLimiter = resolveRateLimiter();
const contactRepository = resolveContactRepository();
```

## Alternatives Considered

### 1. InversifyJS (Rejected)

**Pros**: Feature-rich, well-documented, industry standard
**Cons**: ~30KB bundle size, complex API, overkill for needs

**Rationale**: The site needs basic DI, not the full feature set of InversifyJS.

### 2. TSyringe (Rejected)

**Pros**: Lightweight, maintained by Microsoft
**Cons**: Poor TypeScript inference, limited documentation

**Rationale**: Type safety is a priority; TSyringe's inference is lacking.

### 3. Manual Constructor Injection (Rejected)

**Pros**: Zero dependencies, explicit
**Cons**: Manual dependency management, no singleton handling, no circular dep detection

**Rationale**: DI container provides automation and safety checks that manual injection lacks.

### 4. Custom DI Container (Chosen)

**Pros**:
- Full control over implementation
- Type-safe resolution
- Minimal bundle size (~2KB)
- Built-in circular dependency detection
- Sync and async support

**Cons**:
- Maintenance overhead
- Less feature-rich than frameworks

## Consequences

### Positive

- ✅ **Bundle Size**: ~2KB vs 30KB for InversifyJS
- ✅ **Type Safety**: Full TypeScript inference
- ✅ **Simplicity**: Only needed features, no bloat
- ✅ **Control**: Can extend as needed
- ✅ **Performance**: Fast resolution with Map lookup

### Negative

- ⚠️ **Maintenance**: Custom code to maintain
- ⚠️ **Features**: Lacks advanced features (decorator-based injection, etc.)
- ⚠️ **Community**: No community support

## Implementation Details

### Circular Dependency Detection

```typescript
resolve<T>(key: ServiceKey): Promise<T> {
  const descriptor = this.services.get(key);

  if (descriptor.isResolving) {
    throw new Error(`Circular dependency detected: ${String(key)}`);
  }

  descriptor.isResolving = true;
  try {
    const instance = await descriptor.factory();
    return instance as T;
  } finally {
    descriptor.isResolving = false;
  }
}
```

### Singleton Caching

```typescript
resolve<T>(key: ServiceKey): Promise<T> {
  const descriptor = this.services.get(key);

  // Return cached singleton if available
  if (descriptor.lifetime === 'singleton' && descriptor.instance) {
    return descriptor.instance as T;
  }

  // Create and cache instance
  const instance = await descriptor.factory();
  if (descriptor.lifetime === 'singleton') {
    descriptor.instance = instance;
  }

  return instance as T;
}
```

## Validation

The DI container has been validated through:
1. **Unit Tests**: Container resolution tested with mocks
2. **Integration**: Services successfully resolve in production
3. **Circular Dep Test**: Detection works for circular references
4. **Bundle Analysis**: Confirmed 2KB minified size

## Related Decisions

- [ADR-001: Domain-Driven Design Architecture](./001-ddd-architecture.md)

## References

- [DI Container Implementation](../../src/lib/di/Container.ts)
- [Type-Safe DI Types](../../src/lib/di/types.ts)
- [Service Registration](../../src/lib/di/services.ts)
