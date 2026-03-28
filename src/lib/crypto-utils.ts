/**
 * Cryptographic Utilities
 * Provides secure hashing and encryption functions using Web Crypto API
 */

/**
 * Generate a SHA-256 hash of the input string
 * Uses Web Crypto API for secure, irreversible hashing
 *
 * @param input - String to hash
 * @param salt - Optional salt for added security
 * @returns Hex-encoded hash string
 */
export async function sha256Hash(
  input: string,
  salt?: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt ? `${salt}${input}` : input);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

/**
 * Generate a cryptographically secure random salt
 *
 * @param bytes - Number of bytes for salt (default: 16)
 * @returns Hex-encoded salt string
 */
export function generateSalt(bytes: number = 16): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash an API key with salt for secure storage
 *
 * @param apiKey - The API key to hash
 * @param salt - Salt to use (generates new salt if not provided)
 * @returns Object containing hash and salt used
 */
export async function hashApiKey(
  apiKey: string,
  salt?: string,
): Promise<{ hash: string; salt: string }> {
  const actualSalt = salt || generateSalt(16);
  const hash = await sha256Hash(apiKey, actualSalt);

  return { hash, salt: actualSalt };
}

/**
 * Verify an API key against a stored hash
 *
 * @param apiKey - The API key to verify
 * @param storedHash - The stored hash to compare against
 * @param salt - The salt used when hashing
 * @returns True if the key matches the hash
 */
export async function verifyApiKey(
  apiKey: string,
  storedHash: string,
  salt: string,
): Promise<boolean> {
  const { hash: computedHash } = await hashApiKey(apiKey, salt);
  return computedHash === storedHash;
}

/**
 * Generate a secure random token for API keys, sessions, etc.
 *
 * @param bytes - Number of bytes for token (default: 32)
 * @returns Hex-encoded token string
 */
export function generateSecureToken(bytes: number = 32): string {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constant-time string comparison to prevent timing attacks
 *
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
