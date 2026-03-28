-- Migration: Add salt column to api_keys table for secure hashing
-- Date: 2026-03-28
-- Author: Security Audit Implementation

-- Add salt column to store the salt used for API key hashing
ALTER TABLE api_keys
ADD COLUMN salt VARCHAR(64);

-- Add comment to document the purpose
COMMENT ON COLUMN api_keys.salt IS 'Salt used for SHA-256 hashing of API keys. Required for secure one-way hashing.';

-- Create index for efficient lookups by key_hash and salt
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash_salt
ON api_keys(key_hash, salt)
WHERE is_active = true;

-- Add constraint to ensure salt is present for active keys
ALTER TABLE api_keys
ADD CONSTRAINT api_keys_salt_required
CHECK (
  (is_active = false AND salt IS NULL) OR
  (is_active = true AND salt IS NOT NULL)
);

-- Migration notes:
--
-- IMPORTANT: After running this migration, you need to:
--
-- 1. Migrate existing API keys to use the new secure hashing method
--    See: scripts/migrate-api-keys.ts
--
-- 2. Update the API key generation and validation code to use:
--    import { hashApiKey, verifyApiKey } from '@/lib/crypto-utils'
--
-- 3. Test API key validation thoroughly before deploying
--
-- The old insecure hashing method was:
--    hash_${key.substring(0, 8)}_${key.substring(key.length - 8)}
--
-- The new secure method is:
--    SHA-256(salt + key) with cryptographically secure random salt
--
-- This migration ensures:
-- - API keys are properly salted and hashed
-- - Rainbow table attacks are prevented
-- - Each API key has a unique salt
-- - The hashing is cryptographically secure and irreversible
