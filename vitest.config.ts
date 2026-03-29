import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'tests/',
        '**/*.config.{ts,js}',
        '**/*.d.ts',
        '**/types/**',
        'src/**/types/**',
        'src/middleware.ts',
        'src/app/**/layout.tsx',
      ],
      include: ['src/**/*.{ts,tsx}', 'src/**/*.vue'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
