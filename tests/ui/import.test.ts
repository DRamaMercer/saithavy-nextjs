/**
 * Simple Component Test
 * Basic test to verify UI components can be imported
 */

import { describe, it, expect } from 'vitest';

// Test that component files exist and can be parsed
describe('UI Components - Import Test', () => {
  it('should have Button component file', async () => {
    const buttonModule = await import('@/components/ui/Button');
    expect(buttonModule).toBeDefined();
    expect(buttonModule.default).toBeDefined();
  });

  it('should have Card component file', async () => {
    const cardModule = await import('@/components/ui/Card');
    expect(cardModule).toBeDefined();
    expect(cardModule.default).toBeDefined();
  });

  it('should have Badge component file', async () => {
    const badgeModule = await import('@/components/ui/Badge');
    expect(badgeModule).toBeDefined();
    expect(badgeModule.default).toBeDefined();
  });

  it('should have Input component file', async () => {
    const inputModule = await import('@/components/ui/Input');
    expect(inputModule).toBeDefined();
    expect(inputModule.default).toBeDefined();
  });

  it('should have index file with exports', async () => {
    const indexModule = await import('@/components/ui/index');
    expect(indexModule).toBeDefined();
    // Check that it has exports
    expect(Object.keys(indexModule).length).toBeGreaterThan(0);
  });
});
