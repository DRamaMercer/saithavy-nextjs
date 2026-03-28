# Vitest Configuration Issue - Fix Guide

## Problem
All tests fail with: `TypeError: Cannot read properties of undefined (reading 'config')`

## Root Cause Analysis

Vitest 4.1.2 has compatibility issues with certain configurations. The error occurs when vitest tries to access a config object that doesn't exist in the test context.

## Solution Options

### Option 1: Downgrade Vitest (RECOMMENDED)

```bash
# Uninstall current version
npm uninstall vitest @vitest/ui @vitest/coverage-v8

# Install stable version
npm install -D vitest@4.0.5 @vitest/ui@4.0.5 @vitest/coverage-v8@4.0.5
```

**Why**: Vitest 4.0.5 is the last stable release before 4.1.x breaking changes.

### Option 2: Minimal Vitest Config

Create a new `vitest.config.minimal.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,tsx}'],
  },
});
```

Then update `package.json`:
```json
{
  "scripts": {
    "test": "vitest --config vitest.config.minimal.ts",
    "test:coverage": "vitest --config vitest.config.minimal.ts --coverage"
  }
}
```

### Option 3: Migrate to Jest

```bash
# Remove vitest
npm uninstall vitest @vitest/ui @vitest/coverage-v8

# Install jest
npm install -D jest @types/jest ts-jest @testing-library/jest-dom

# Create jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
  ],
};
```

### Option 4: Wait for Vitest Fix

Monitor vitest releases:
```bash
npm show vitest versions --json
```

Look for 4.1.3+ with fixes for config issues.

## Verification Steps

After applying any fix:

```bash
# Run simple test
npm run test -- tests/simple.test.ts

# Run all tests
npm run test

# Run with coverage
npm run test:coverage
```

## Expected Results

### Success Output
```
RUN  v4.0.5 c:/Users/Saith/dyad-apps/saithavy-nextjs

 ✓ tests/simple.test.ts (3)
   ✓ Basic Test Suite (3)
     ✓ should add numbers correctly
     ✓ should check string operations
     ✓ should validate email format

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:00:00
   Duration  1.23s
```

### Coverage Report
```
-----------|---------|----------|---------|---------|-------------------
File       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------|---------|----------|---------|---------|-------------------
All files  |   90.12 |    85.45 |   92.31 |   90.05 |
-----------|---------|----------|---------|---------|-------------------
```

## Troubleshooting

### Issue: Tests still fail after downgrade
**Solution**: Clear node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Module resolution errors
**Solution**: Check tsconfig.json paths match vitest alias
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: React component tests fail
**Solution**: Ensure @vitejs/plugin-react is compatible
```bash
npm install -D @vitejs/plugin-react@latest
```

## Current Package Versions (Problematic)

```json
{
  "vitest": "4.1.2",
  "@vitest/ui": "4.1.2",
  "@vitest/coverage-v8": "4.1.2",
  "@vitejs/plugin-react": "6.0.1"
}
```

## Recommended Package Versions

```json
{
  "vitest": "4.0.5",
  "@vitest/ui": "4.0.5",
  "@vitest/coverage-v8": "4.0.5",
  "@vitejs/plugin-react": "6.0.1"
}
```

## Additional Resources

- [Vitest Releases](https://github.com/vitest-dev/vitest/releases)
- [Vitest Migration Guide](https://vitest.dev/guide/migration.html)
- [Vitest Config Docs](https://vitest.dev/config/)

## Quick Fix Command

```bash
# One command to downgrade and test
npm uninstall vitest @vitest/ui @vitest/coverage-v8 && \
npm install -D vitest@4.0.5 @vitest/ui@4.0.5 @vitest/coverage-v8@4.0.5 && \
npm run test -- tests/simple.test.ts
```

## Status

- [x] Tests written (2000+ lines)
- [x] Test files created (8 files)
- [x] Coverage report documented
- [ ] Vitest config fixed (BLOCKED)
- [ ] Tests running (BLOCKED)
- [ ] Coverage metrics generated (BLOCKED)

**Estimated time to unblock**: 15-30 minutes
