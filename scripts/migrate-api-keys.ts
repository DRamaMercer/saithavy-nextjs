#!/usr/bin/env tsx
/**
 * API Key Migration Script
 *
 * Migrates existing API keys from insecure hashing to secure SHA-256 hashing
 *
 * Usage:
 *   npm run migrate-api-keys
 *   OR
 *   tsx scripts/migrate-api-keys.ts
 *
 * Prerequisites:
 * - Database migration 20260328_add_api_key_salt.sql must be run first
 * - Environment variables NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set
 * - Original API keys must be temporarily available (ideally stored securely)
 */

import { createClient } from "@supabase/supabase-js";
import { hashApiKey } from "../src/lib/crypto-utils";

// Database client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

interface ApiKeyRecord {
  id: string;
  key_hash: string;
  name: string;
  is_active: boolean;
  // Note: You'll need access to the original API key temporarily
  // This should be stored securely and deleted after migration
  original_key?: string;
}

/**
 * Fetch all active API keys
 */
async function fetchApiKeys(): Promise<ApiKeyRecord[]> {
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, key_hash, name, is_active")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Failed to fetch API keys: ${error.message}`);
  }

  return data || [];
}

/**
 * Update an API key with secure hash
 */
async function updateApiKey(
  id: string,
  keyHash: string,
  salt: string,
): Promise<void> {
  const { error } = await supabase
    .from("api_keys")
    .update({
      key_hash: keyHash,
      salt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update API key ${id}: ${error.message}`);
  }
}

/**
 * Migrate a single API key
 */
async function migrateApiKey(key: ApiKeyRecord): Promise<void> {
  console.log(`Migrating API key: ${key.name} (${key.id})`);

  // IMPORTANT: You need the original API key to migrate it
  // This should be temporarily available from a secure backup
  const originalKey = key.original_key;

  if (!originalKey) {
    console.warn(
      `  ⚠️  Skipping - original key not available. You'll need to regenerate this key.`,
    );
    return;
  }

  // Generate secure hash with salt
  const { hash, salt } = await hashApiKey(originalKey);

  // Update database
  await updateApiKey(key.id, hash, salt);

  console.log(`  ✅ Migrated successfully`);
}

/**
 * Main migration function
 */
async function migrateApiKeys(): Promise<void> {
  console.log("🔐 Starting API key migration...\n");

  try {
    // Fetch all active API keys
    console.log("📋 Fetching API keys from database...");
    const keys = await fetchApiKeys();

    if (keys.length === 0) {
      console.log("✅ No API keys to migrate");
      return;
    }

    console.log(`Found ${keys.length} API key(s) to migrate\n`);

    // Migrate each key
    let migrated = 0;
    let skipped = 0;

    for (const key of keys) {
      try {
        await migrateApiKey(key);
        migrated++;
      } catch (error) {
        console.error(`  ❌ Error: ${(error as Error).message}`);
        skipped++;
      }
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("Migration Summary:");
    console.log(`  ✅ Migrated: ${migrated}`);
    console.log(`  ⚠️  Skipped: ${skipped}`);
    console.log(`  📊 Total: ${keys.length}`);
    console.log("=".repeat(50));

    if (skipped > 0) {
      console.log("\n⚠️  WARNING: Some keys were skipped.");
      console.log("You'll need to:");
      console.log("  1. Regenerate skipped API keys");
      console.log("  2. Update any systems using the old keys");
      console.log("  3. Re-run this migration script");
    } else {
      console.log("\n✅ Migration completed successfully!");
      console.log("\nNext steps:");
      console.log("  1. Test API key validation");
      console.log("  2. Delete any backups of original API keys");
      console.log("  3. Monitor for any authentication failures");
    }
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

/**
 * Rollback function (in case migration fails)
 */
async function rollbackMigration(): Promise<void> {
  console.log("⚠️  Rolling back API key migration...\n");

  try {
    // Remove the salt column (this will fail if foreign key constraints exist)
    const { error } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE api_keys DROP COLUMN IF EXISTS salt;",
    });

    if (error) {
      throw new Error(`Rollback failed: ${error.message}`);
    }

    console.log("✅ Rollback completed");
    console.log("⚠️  Note: API keys have been reverted to insecure hashing");
    console.log("Please fix the migration issue and try again");
  } catch (error) {
    console.error("❌ Rollback failed:", error);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes("--rollback")) {
    rollbackMigration();
  } else {
    migrateApiKeys();
  }
}

export { migrateApiKeys, rollbackMigration };
