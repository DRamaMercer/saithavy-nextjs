/**
 * Crypto Utilities Tests
 * Tests for SHA-256 hashing, salt generation, API key hashing, and constant-time comparison
 */

import { describe, it, expect } from 'vitest';
import {
  sha256Hash,
  generateSalt,
  hashApiKey,
  verifyApiKey,
  generateSecureToken,
  constantTimeCompare,
} from '@/lib/crypto-utils';

describe('Crypto Utilities', () => {
  describe('sha256Hash', () => {
    it('should produce a hex-encoded SHA-256 hash', async () => {
      const hash = await sha256Hash('hello');

      // SHA-256 produces 64 hex characters
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should produce deterministic output for the same input', async () => {
      const hash1 = await sha256Hash('test-input');
      const hash2 = await sha256Hash('test-input');

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', async () => {
      const hash1 = await sha256Hash('input-a');
      const hash2 = await sha256Hash('input-b');

      expect(hash1).not.toBe(hash2);
    });

    it('should produce different hashes with salt vs without', async () => {
      const withoutSalt = await sha256Hash('password');
      const withSalt = await sha256Hash('password', 'salt123');

      expect(withoutSalt).not.toBe(withSalt);
    });

    it('should produce different hashes for different salts', async () => {
      const hash1 = await sha256Hash('password', 'salt1');
      const hash2 = await sha256Hash('password', 'salt2');

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string input', async () => {
      const hash = await sha256Hash('');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });
  });

  describe('generateSalt', () => {
    it('should generate a hex string of correct length', () => {
      const salt = generateSalt(16);
      // 16 bytes = 32 hex characters
      expect(salt).toHaveLength(32);
      expect(salt).toMatch(/^[0-9a-f]{32}$/);
    });

    it('should respect the bytes parameter', () => {
      const salt8 = generateSalt(8);
      const salt32 = generateSalt(32);

      expect(salt8).toHaveLength(16);
      expect(salt32).toHaveLength(64);
    });

    it('should generate unique salts', () => {
      const salt1 = generateSalt();
      const salt2 = generateSalt();

      expect(salt1).not.toBe(salt2);
    });

    it('should default to 16 bytes', () => {
      const salt = generateSalt();
      expect(salt).toHaveLength(32);
    });
  });

  describe('hashApiKey', () => {
    it('should return hash and salt', async () => {
      const result = await hashApiKey('my-api-key');

      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('salt');
      expect(result.hash).toHaveLength(64);
      expect(result.salt).toHaveLength(32);
    });

    it('should use provided salt when given', async () => {
      const salt = generateSalt(16);
      const result = await hashApiKey('my-api-key', salt);

      expect(result.salt).toBe(salt);
    });

    it('should generate new salt when not provided', async () => {
      const result1 = await hashApiKey('my-api-key');
      const result2 = await hashApiKey('my-api-key');

      expect(result1.salt).not.toBe(result2.salt);
      expect(result1.hash).not.toBe(result2.hash);
    });

    it('should produce same hash with same key and salt', async () => {
      const salt = generateSalt(16);
      const result1 = await hashApiKey('my-api-key', salt);
      const result2 = await hashApiKey('my-api-key', salt);

      expect(result1.hash).toBe(result2.hash);
    });
  });

  describe('verifyApiKey', () => {
    it('should return true for matching key', async () => {
      const { hash, salt } = await hashApiKey('correct-key');
      const result = await verifyApiKey('correct-key', hash, salt);

      expect(result).toBe(true);
    });

    it('should return false for non-matching key', async () => {
      const { hash, salt } = await hashApiKey('correct-key');
      const result = await verifyApiKey('wrong-key', hash, salt);

      expect(result).toBe(false);
    });

    it('should return false with wrong salt', async () => {
      const { hash } = await hashApiKey('correct-key');
      const wrongSalt = generateSalt(16);
      const result = await verifyApiKey('correct-key', hash, wrongSalt);

      expect(result).toBe(false);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate a hex string of correct length', () => {
      const token = generateSecureToken(32);
      // 32 bytes = 64 hex characters
      expect(token).toHaveLength(64);
      expect(token).toMatch(/^[0-9a-f]{64}$/);
    });

    it('should respect the bytes parameter', () => {
      const token16 = generateSecureToken(16);
      const token64 = generateSecureToken(64);

      expect(token16).toHaveLength(32);
      expect(token64).toHaveLength(128);
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();

      expect(token1).not.toBe(token2);
    });

    it('should default to 32 bytes', () => {
      const token = generateSecureToken();
      expect(token).toHaveLength(64);
    });
  });

  describe('constantTimeCompare', () => {
    it('should return true for identical strings', () => {
      expect(constantTimeCompare('hello', 'hello')).toBe(true);
      expect(constantTimeCompare('abc123', 'abc123')).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(constantTimeCompare('hello', 'world')).toBe(false);
      expect(constantTimeCompare('abc', 'def')).toBe(false);
    });

    it('should return false for strings of different length', () => {
      expect(constantTimeCompare('short', 'longer-string')).toBe(false);
      expect(constantTimeCompare('abc', 'ab')).toBe(false);
    });

    it('should return true for empty strings', () => {
      expect(constantTimeCompare('', '')).toBe(true);
    });

    it('should be sensitive to single character differences', () => {
      expect(constantTimeCompare('aaaa', 'aaab')).toBe(false);
    });
  });
});
