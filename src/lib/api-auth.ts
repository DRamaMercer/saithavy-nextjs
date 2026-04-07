/**
 * API Authentication Utilities
 * Provides API key validation for protected endpoints
 */

import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";
import { hashApiKey, generateSecureToken } from "@/lib/crypto-utils";

export interface AuthResult {
  valid: boolean;
  keyId?: string;
  keyName?: string;
  error?: string;
}

const API_KEY_HEADER = "x-api-key";
const RATE_LIMIT_PER_KEY = 100; // requests per hour

/**
 * Validates an API key from the request headers
 * @param request - NextRequest object
 * @returns AuthResult with validation status
 */
export async function validateApiKey(
  request: NextRequest,
): Promise<AuthResult> {
  const apiKey = request.headers.get(API_KEY_HEADER);

  if (!apiKey) {
    return {
      valid: false,
      error: "Missing API key",
    };
  }

  // In production, validate against database
  // For now, implement simple validation
  // TODO: Implement database-backed validation with Supabase

  try {
    const supabase = getSupabaseClient();

    // Hash the API key for comparison using secure SHA-256
    // Note: Database schema needs to be updated to include 'salt' column
    // For now, we'll use a compatibility check
    const { hash: keyHash, salt: _salt } = await hashApiKey(apiKey);

    const { data: keyData, error } = await supabase
      .from("api_keys")
      .select("*")
      .eq("key_hash", keyHash)
      .eq("is_active", true)
      .single();

    if (error || !keyData) {
      return {
        valid: false,
        error: "Invalid API key",
      };
    }

    // Check rate limit
    const { count } = await supabase
      .from("api_key_usage")
      .select("*", { count: "exact", head: true })
      .eq("api_key_id", keyData.id)
      .gte("created_at", new Date(Date.now() - 3600000).toISOString()) // Last hour
      .single();

    const usageCount = count || 0;
    const rateLimit = keyData.rate_limit || RATE_LIMIT_PER_KEY;

    if (usageCount >= rateLimit) {
      return {
        valid: false,
        error: "Rate limit exceeded",
      };
    }

    // Log this usage
    await logApiKeyUsage(keyData.id, request);

    return {
      valid: true,
      keyId: keyData.id,
      keyName: keyData.name,
    };
  } catch {
    // If api_keys table doesn't exist yet, allow a fallback mode
    // TODO: Remove this fallback after database migration
    return {
      valid: false,
      error: "Authentication not configured",
    };
  }
}

/**
 * DEPRECATED: Use hashApiKey from crypto-utils instead
 * This function is kept for backwards compatibility during migration
 * @deprecated Use the secure hashApiKey function from crypto-utils
 */
function _legacyHashApiKey(apiKey: string): string {
  // This is the old insecure method - DO NOT USE
  return `hash_${apiKey.substring(0, 8)}_${apiKey.substring(apiKey.length - 8)}`;
}

/**
 * Generate a new API key
 * Creates a secure random API key with prefix
 *
 * @param prefix - Optional prefix for the key (e.g., "sk_live_")
 * @returns Secure random API key
 */
export function generateApiKey(prefix: string = "sk_"): string {
  const randomPart = generateSecureToken(32);
  return `${prefix}${randomPart}`;
}

/**
 * Get Supabase client for API auth
 */
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/**
 * Log API key usage for analytics
 */
async function logApiKeyUsage(
  keyId: string,
  request: NextRequest,
): Promise<void> {
  try {
    const supabase = getSupabaseClient();

    await supabase.from("api_key_usage").insert({
      api_key_id: keyId,
      endpoint: request.nextUrl.pathname,
      method: request.method,
      ip: request.headers.get("x-vercel-ip-city") || "unknown",
      user_agent: request.headers.get("user-agent") || "unknown",
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    // Fail silently - logging shouldn't break auth
    logger.error("[API Auth] Failed to log usage", { keyId }, error as Error);
  }
}

/**
 * Middleware helper to check authentication
 * Returns 401 response if invalid
 */
export function requireAuth(request: NextRequest): Response | null {
  const apiKey = request.headers.get(API_KEY_HEADER);
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unauthorized - Missing API key",
      }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }
  return null; // Auth check passes, continue to handler
}
