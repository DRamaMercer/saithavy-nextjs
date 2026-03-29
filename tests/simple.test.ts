/**
 * Simple Test
 * Basic test to verify vitest is working
 */

import { describe, it, expect } from 'vitest';

describe('Basic Test Suite', () => {
  it('should add numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should check string operations', () => {
    const str = 'hello';
    expect(str.toUpperCase()).toBe('HELLO');
  });

  it('should validate email format', () => {
    const email = 'test@example.com';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    expect(emailRegex.test(email)).toBe(true);
  });
});
