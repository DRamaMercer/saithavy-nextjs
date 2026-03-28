/**
 * Validators Tests
 * Tests for utility validation functions
 */

import { describe, it, expect } from 'vitest';

describe('Validators', () => {
  describe('Email Validation', () => {
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    it('should accept valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.com')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('test123@test-domain.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('test@.com')).toBe(false);
      expect(isValidEmail('test..test@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should reject email with spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false);
      expect(isValidEmail('test@ example.com')).toBe(false);
      expect(isValidEmail(' test@example.com')).toBe(false);
    });

    it('should reject email without TLD', () => {
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('test@localhost')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    const isValidUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    it('should accept valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=value')).toBe(true);
      expect(isValidUrl('https://example.com:8080')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false); // Only http/https
    });
  });

  describe('Name Validation', () => {
    const isValidName = (name: string): boolean => {
      return typeof name === 'string' &&
             name.length >= 2 &&
             name.length <= 100 &&
             /^[a-zA-Z\s'-]+$/.test(name);
    };

    it('should accept valid names', () => {
      expect(isValidName('John Doe')).toBe(true);
      expect(isValidName('Mary-Jane Smith')).toBe(true);
      expect(isValidName("O'Connor")).toBe(true);
      expect(isValidName('Émilie Dubois')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('A')).toBe(false); // Too short
      expect(isValidName('A'.repeat(101))).toBe(false); // Too long
      expect(isValidName('John123')).toBe(false); // Numbers
      expect(isValidName('John@Doe')).toBe(false); // Special chars
      expect(isValidName('')).toBe(false); // Empty
    });

    it('should reject names with only whitespace', () => {
      expect(isValidName('   ')).toBe(false);
      expect(isValidName('\t\n')).toBe(false);
    });
  });

  describe('Slug Validation', () => {
    const isValidSlug = (slug: string): boolean => {
      return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
    };

    it('should accept valid slugs', () => {
      expect(isValidSlug('test-slug')).toBe(true);
      expect(isValidSlug('my-resource-123')).toBe(true);
      expect(isValidSlug('mindful-leadership')).toBe(true);
      expect(isValidSlug('ai-automation-guide')).toBe(true);
    });

    it('should reject invalid slugs', () => {
      expect(isValidSlug('Test-Slug')).toBe(false); // Uppercase
      expect(isValidSlug('test_slug')).toBe(false); // Underscore
      expect(isValidSlug('test--slug')).toBe(false); // Double hyphen
      expect(isValidSlug('-test-slug')).toBe(false); // Leading hyphen
      expect(isValidSlug('test-slug-')).toBe(false); // Trailing hyphen
      expect(isValidSlug('')).toBe(false); // Empty
    });
  });

  describe('Message Validation', () => {
    const isValidMessage = (message: string, min: number = 10, max: number = 5000): boolean => {
      return typeof message === 'string' &&
             message.trim().length >= min &&
             message.trim().length <= max;
    };

    it('should accept valid messages', () => {
      expect(isValidMessage('This is a valid message.')).toBe(true);
      expect(isValidMessage('A'.repeat(100))).toBe(true);
    });

    it('should reject short messages', () => {
      expect(isValidMessage('Short')).toBe(false);
      expect(isValidMessage('')).toBe(false);
      expect(isValidMessage('   ')).toBe(false);
    });

    it('should reject long messages', () => {
      expect(isValidMessage('A'.repeat(5001))).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(isValidMessage('   Test message   ')).toBe(true);
      expect(isValidMessage('   ')).toBe(false);
    });
  });

  describe('Phone Validation', () => {
    const isValidPhone = (phone: string): boolean => {
      const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
      return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    it('should accept valid phone numbers', () => {
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('(123) 456-7890')).toBe(true);
      expect(isValidPhone('123-456-7890')).toBe(true);
      expect(isValidPhone('1234567890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('123')).toBe(false); // Too short
      expect(isValidPhone('abc-def-ghij')).toBe(false); // Letters
      expect(isValidPhone('')).toBe(false); // Empty
    });
  });

  describe('Sanitization Functions', () => {
    const sanitizeString = (input: string): string => {
      return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    };

    it('should remove HTML tags', () => {
      expect(sanitizeString('<p>Hello</p>')).toBe('Hello');
      expect(sanitizeString('<div>Test</div>')).toBe('Test');
      expect(sanitizeString('<a href="link">Link</a>')).toBe('Link');
    });

    it('should remove script tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>Test')).toBe('Test');
      expect(sanitizeString('Text<script>alert("xss")</script>')).toBe('Text');
    });

    it('should preserve text content', () => {
      expect(sanitizeString('Normal text')).toBe('Normal text');
      expect(sanitizeString('Text with numbers 123')).toBe('Text with numbers 123');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  Text  ')).toBe('Text');
      expect(sanitizeString('\nText\n')).toBe('Text');
    });
  });
});
