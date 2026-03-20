# Dependency Injection Container

## Overview

This project uses a lightweight Dependency Injection (DI) container to manage service dependencies and their lifecycles. The DI container improves testability, maintainability, and follows SOLID principles.

## Architecture

The DI container is located in `src/lib/di/` and consists of:

- **Container.ts**: Core DI container implementation
- **services.ts**: Service registration and resolver helpers
- **types.ts**: Type-safe utilities for the container

## Features

- **Singleton & Transient Lifecycles**: Control service instance creation
- **Type-Safe Resolution**: Full TypeScript support with type inference
- **Circular Dependency Detection**: Prevents infinite loops
- **Async Factory Support**: Handles async service initialization
- **Global Container**: Shared container instance across the application

## Usage

### Registering Services

Services are registered in `src/lib/di/services.ts`:

```typescript
import { getContainer } from './Container';
import { IContactRepository } from '@/domain/interfaces/IContactRepository';
import { LoggerContactRepository } from '@/adapters/repositories/LoggerContactRepository';

export function registerCoreServices(): void {
  const container = getContainer();

  // Register a singleton service
  container.register<IContactRepository>(
    ServiceKeys.ContactRepository,
    () => new LoggerContactRepository(),
    'singleton'
  );

  // Register a transient service (new instance each time)
  container.register<ITransientService>(
    ServiceKeys.TransientService,
    () => new TransientService(),
    'transient'
  );
}
```

### Resolving Services

Use the helper functions from `services.ts`:

```typescript
import { resolveContactRepository, resolveRateLimiter } from '@/lib/di/services';

// Synchronous resolution (factory must be sync)
const repository = resolveContactRepository();

// Asynchronous resolution (factory can be async)
const rateLimiter = await resolveRateLimiter();
```

Or use the container directly:

```typescript
import { getContainer, ServiceKeys } from '@/lib/di/Container';

const container = getContainer();

// Sync resolution
const repository = container.resolveSync<IContactRepository>(
  ServiceKeys.ContactRepository
);

// Async resolution
const rateLimiter = await container.resolve<IRateLimiter>(
  ServiceKeys.RateLimiter
);
```

### Using in API Routes

```typescript
import { resolveContactRepository, resolveRateLimiter } from '@/lib/di/services';
import { SubmitContactUseCase } from '@/use_cases/SubmitContactUseCase';

// Use case is initialized with container-resolved dependencies
const submitContactUseCase = new SubmitContactUseCase(
  resolveRateLimiter,
  resolveContactRepository
);

export async function POST(request: NextRequest) {
  // Use the use case
  const response = await submitContactUseCase.execute({ ip, body });
  // ...
}
```

## Service Keys

Service keys are defined as symbols to avoid naming conflicts:

```typescript
export const ServiceKeys = {
  ContactRepository: Symbol('ContactRepository'),
  RateLimiter: Symbol('RateLimiter'),
  Logger: Symbol('Logger'),
} as const;
```

## Testing

The container can be reset for testing:

```typescript
import { resetContainer } from '@/lib/di/Container';
import { registerTestServices } from '@/lib/di/services';

beforeEach(() => {
  resetContainer();
  registerTestServices();
});
```

## Best Practices

1. **Use Singlel
```typescript
// Good: Stateless service as singleton
container.register(
  ServiceKeys.Repository,
  () => new Repository(),
  'singleton'
);

// Good: Stateful service as transient
container.register(
  ServiceKeys.RequestContext,
  () => new RequestContext(),
  'transient'
);
```

2. **Register All Services in One Place**: Keep service registration centralized in `services.ts`

3. **Use Type-Safe Helpers**: Prefer `resolve*` helper functions over direct container access

4. **Avoid Circular Dependencies**: The container will detect and throw an error

5. **Keep Factories Simple**: Factories should only create instances, not contain business logic

## Advanced Usage

### Type-Safe Service Keys

```typescript
import { createServiceKey, TypedDIContainer } from '@/lib/di/types';

const UserRepositoryKey = createServiceKey<IUserRepository>(
  Symbol('UserRepository')
);

const container = new TypedDIContainer(getContainer());
container.register(
  UserRepositoryKey.key,
  () => new UserRepository()
);

const repository = container.resolveSync(UserRepositoryKey.key);
```

### Conditional Registration

```typescript
if (process.env.NODE_ENV === 'test') {
  container.register(
    ServiceKeys.EmailService,
    () => new MockEmailService()
  );
} else {
  container.register(
    ServiceKeys.EmailService,
    () => new SendgridEmailService()
  );
}
```

## Migration

The codebase has been migrated from manual dependency instantiation to DI container usage:

**Before:**
```typescript
const rateLimiter = new UpstashRateLimiterAdapter();
const contactRepository = new LoggerContactRepository();
const submitContactUseCase = new SubmitContactUseCase(rateLimiter, contactRepository);
```

**After:**
```typescript
import { resolveContactRepository, resolveRateLimiter } from '@/lib/di/services';

const submitContactUseCase = new SubmitContactUseCase(
  resolveRateLimiter,
  resolveContactRepository
);
```

## Resources

- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Inversion of Control Containers](https://martinfowler.com/articles/injection.html)
