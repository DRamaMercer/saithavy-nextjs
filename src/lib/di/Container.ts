/**
 * Lightweight Dependency Injection Container
 *
 * Supports:
 * - Singleton lifecycle (default)
 * - Transient lifecycle (new instance each time)
 * - Type-safe service registration and resolution
 * - Circular dependency detection
 *
 * Usage Patterns:
 *
 * 1. Production (Global Container):
 * ```typescript
 * import { getContainer, ServiceKeys } from './di/Container';
 *
 * const container = getContainer();
 * const rateLimiter = await container.resolve(ServiceKeys.RateLimiter);
 * ```
 *
 * 2. Testing (Isolated Containers):
 * ```typescript
 * import { DIContainer, ServiceKeys, resetContainer } from './di/Container';
 *
 * beforeEach(() => {
 *   // Create isolated container for each test
 *   const container = new DIContainer();
 *   container.register(ServiceKeys.RateLimiter, () => mockRateLimiter);
 * });
 *
 * afterAll(() => {
 *   // Clean up global state
 *   resetContainer();
 * });
 * ```
 *
 * 3. Request-Scoped (Advanced):
 * ```typescript
 * // For each request, create a new container instance
 * export async function bootstrapContainer(): Promise<DIContainer> {
 *   const container = new DIContainer();
 *   await registerServices(container);
 *   return container;
 * }
 * ```
 */

type ServiceLifetime = "singleton" | "transient";

type ServiceFactory<T> = () => T | Promise<T>;

interface ServiceDescriptor<T> {
  factory: ServiceFactory<T>;
  lifetime: ServiceLifetime;
  instance?: T;
  isResolving: boolean;
}

type ServiceKey = string | symbol;

/**
 * Dependency Injection Container
 */
export class DIContainer {
  private services = new Map<ServiceKey, ServiceDescriptor<unknown>>();

  /**
   * Register a service with the container
   */
  register<T>(
    key: ServiceKey,
    factory: ServiceFactory<T>,
    lifetime: ServiceLifetime = "singleton",
  ): void {
    if (this.services.has(key)) {
      throw new Error(`Service already registered: ${String(key)}`);
    }

    this.services.set(key, {
      factory,
      lifetime,
      isResolving: false,
    });
  }

  /**
   * Register or replace a service
   */
  registerOrUpdate<T>(
    key: ServiceKey,
    factory: ServiceFactory<T>,
    lifetime: ServiceLifetime = "singleton",
  ): void {
    this.services.set(key, {
      factory,
      lifetime,
      isResolving: false,
    });
  }

  /**
   * Resolve a service from the container
   */
  async resolve<T>(key: ServiceKey): Promise<T> {
    const descriptor = this.services.get(key);

    if (!descriptor) {
      throw new Error(`Service not registered: ${String(key)}`);
    }

    // Check for circular dependencies
    if (descriptor.isResolving) {
      throw new Error(`Circular dependency detected: ${String(key)}`);
    }

    // Return singleton instance if available
    if (descriptor.lifetime === "singleton" && descriptor.instance) {
      return descriptor.instance as T;
    }

    // Mark as resolving
    descriptor.isResolving = true;

    try {
      // Create new instance
      const instance = await descriptor.factory();

      // Store singleton instance
      if (descriptor.lifetime === "singleton") {
        descriptor.instance = instance;
      }

      return instance as T;
    } finally {
      descriptor.isResolving = false;
    }
  }

  /**
   * Resolve a service synchronously (factory must return non-async)
   */
  resolveSync<T>(key: ServiceKey): T {
    const descriptor = this.services.get(key);

    if (!descriptor) {
      throw new Error(`Service not registered: ${String(key)}`);
    }

    // Check for circular dependencies
    if (descriptor.isResolving) {
      throw new Error(`Circular dependency detected: ${String(key)}`);
    }

    // Return singleton instance if available
    if (descriptor.lifetime === "singleton" && descriptor.instance) {
      return descriptor.instance as T;
    }

    // Mark as resolving
    descriptor.isResolving = true;

    try {
      // Create new instance
      const instance = descriptor.factory();

      // Handle async factories
      if (instance instanceof Promise) {
        throw new Error(
          `Cannot resolve async factory synchronously: ${String(key)}`,
        );
      }

      // Store singleton instance
      if (descriptor.lifetime === "singleton") {
        descriptor.instance = instance;
      }

      return instance as T;
    } finally {
      descriptor.isResolving = false;
    }
  }

  /**
   * Check if a service is registered
   */
  has(key: ServiceKey): boolean {
    return this.services.has(key);
  }

  /**
   * Clear all singleton instances
   */
  clear(): void {
    this.services.forEach((descriptor) => {
      descriptor.instance = undefined;
    });
  }

  /**
   * Remove a service from the container
   */
  unregister(key: ServiceKey): void {
    this.services.delete(key);
  }

  /**
   * Get all registered service keys
   */
  keys(): ServiceKey[] {
    return Array.from(this.services.keys());
  }
}

/**
 * Global container instance
 */
let globalContainer: DIContainer | null = null;

/**
 * Get or create the global container
 */
export function getContainer(): DIContainer {
  if (!globalContainer) {
    globalContainer = new DIContainer();
  }
  return globalContainer;
}

/**
 * Reset the global container
 *
 * Usage:
 * - Testing: Call in beforeEach/afterEach to create isolated test environments
 * - Development: Reset state when needed
 *
 * WARNING: Do not call in production code as it clears all singleton instances
 */
export function resetContainer(): void {
  if (globalContainer) {
    globalContainer.clear();
  }
  globalContainer = null;
}

/**
 * Create a new isolated container instance
 *
 * Preferred for testing and request-scoped scenarios.
 * Each call creates a completely independent container.
 *
 * @example
 * ```typescript
 * // In tests
 * const testContainer = createContainer();
 * testContainer.register(ServiceKeys.RateLimiter, () => mockRateLimiter);
 * ```
 */
export function createContainer(): DIContainer {
  return new DIContainer();
}

/**
 * Type-safe service keys
 */
export const ServiceKeys = {
  // Repositories
  ContactRepository: Symbol("ContactRepository"),
  RateLimiter: Symbol("RateLimiter"),
  Logger: Symbol("Logger"),
} as const;
