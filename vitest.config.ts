/**
 * Vitest configuration for testing.
 * 
 * Configures test environment, coverage settings, and path aliases.
 * Excludes certain files from coverage reporting.
 */
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.ts?(x)'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json', 'lcov'],
      reportsDirectory: 'coverage',
      exclude: [
        'next.config.*',
        'postcss.config.*',
        'tailwind.config.*',
        'middleware.*',
        '**/*.d.ts',
        '**/node_modules/**',
        '**/.next/**',
        'app/**/page.tsx',
        'app/layout.tsx',
        'components/site/**',
        'components/ui/**',
        'components/**.example.*',
        'lib/supabase/**',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 55,
        statements: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
});
