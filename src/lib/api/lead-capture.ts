/**
 * Lead Capture Service
 *
 * Handles capturing lead information from download requests
 * and other conversion points.
 */

import { logger } from "@/lib/logger";

export interface LeadCaptureData {
  firstName: string;
  email: string;
  resourceSlug: string;
  source: string;
}

export interface LeadCaptureResult {
  success: boolean;
}

/**
 * Captures lead information from user interactions.
 *
 * @param data - Lead capture data including name, email, resource, and source
 * @returns Promise resolving to capture result
 */
export async function captureLead(
  data: LeadCaptureData,
): Promise<LeadCaptureResult> {
  const { firstName, email, resourceSlug, source } = data;

  logger.info("[Lead Capture] Capturing lead", {
    firstName,
    email,
    resourceSlug,
    source,
  });

  // TODO: Persist lead to database or external service
  // e.g., await db.leads.create({ firstName, email, resourceSlug, source });

  return { success: true };
}
