/**
 * Type-safe DI Container Utilities
 *
 * Provides type-safe service registration and resolution.
 */

import { DIContainer, ServiceKeys } from './Container';

/**
 * Type for service keys
 */
export type ServiceKey = typeof ServiceKeys[keyof typeof ServiceKeys];

/**
 * Type-safe service registry
 */
export interface ServiceRegistry {
  register<T>(
    key: ServiceKey,
    factory: () => T | Promise<T>,
    lifetime?: 'singleton' | 'transient'
  ): void;
  resolve<T>(key: ServiceKey): Promise<T>;
  resolveSync<T>(key: ServiceKey): T;
  has(key: ServiceKey): boolean;
}

/**
 * Typed service keys for type safety
 */
export interface TypedServiceKey<T> {
  readonly __type: T;
  readonly key: ServiceKey;
}

/**
 * Create a typed service key
 */
export function createServiceKey<T>(
  key: ServiceKey
): TypedServiceKey<T> {
  return { key, __type: null as unknown as T };
}

/**
 * Type-safe container wrapper
 */
export class TypedDIContainer implements ServiceRegistry {
  constructor(private container: DIContainer) {}

  register<T>(
    key: ServiceKey,
    factory: () => T | Promise<T>,
    lifetime: 'singleton' | 'transient' = 'singleton'
  ): void {
    this.container.register(key, factory, lifetime);
  }

  async resolve<T>(key: ServiceKey): Promise<T> {
    return this.container.resolve<T>(key);
  }

  resolveSync<T>(key: ServiceKey): T {
    return this.container.resolveSync<T>(key);
  }

  has(key: ServiceKey): boolean {
    return this.container.has(key);
  }

  get underlyingContainer(): DIContainer {
    return this.container;
  }
}

/**
 * Service descriptor for compile-time type checking
 */
export type ServiceDescriptor<T> = {
  key: ServiceKey;
  factory: () => T | Promise<T>;
  lifetime?: 'singleton' | 'transient';
};

/**
 * Register multiple services at once with type safety
 */
export function registerServices(
  container: TypedDIContainer,
  services: ServiceDescriptor<unknown>[]
): void {
  services.forEach(({ key, factory, lifetime }) => {
    container.register(key, factory, lifetime);
  });
}
