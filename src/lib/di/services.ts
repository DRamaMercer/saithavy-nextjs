/**
 * Service Registration
 *
 * Centralizes all service registrations with the DI container.
 */

import { getContainer, ServiceKeys } from "./Container";
import { IContactRepository } from "@/domain/interfaces/IContactRepository";
import { LoggerContactRepository } from "@/adapters/repositories/LoggerContactRepository";
import { IRateLimiter } from "@/domain/interfaces/IRateLimiter";
import { UpstashRateLimiterAdapter } from "@/adapters/gateways/UpstashRateLimiterAdapter";

/**
 * Register all core services with the container
 */
export function registerCoreServices(): void {
  const container = getContainer();

  // Register Contact Repository
  container.register<IContactRepository>(
    ServiceKeys.ContactRepository,
    () => {
      return new LoggerContactRepository();
    },
    "singleton",
  );

  // Register Rate Limiter
  container.register<IRateLimiter>(
    ServiceKeys.RateLimiter,
    () => {
      return new UpstashRateLimiterAdapter();
    },
    "singleton",
  );
}

/**
 * Register test services (useful for testing)
 */
export function registerTestServices(): void {
  const container = getContainer();

  // Override with mock implementations if needed
  // container.registerOrUpdate(ServiceKeys.ContactRepository, () => new MockContactRepository());
}

/**
 * Auto-register services on module import
 */
registerCoreServices();

/**
 * Service resolver helpers
 */
export function resolveContactRepository(): IContactRepository {
  return getContainer().resolveSync<IContactRepository>(
    ServiceKeys.ContactRepository,
  );
}

export async function resolveRateLimiter(): Promise<IRateLimiter> {
  return getContainer().resolve<IRateLimiter>(ServiceKeys.RateLimiter);
}
