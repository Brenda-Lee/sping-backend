/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import analog from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [analog()],
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts']
  }
});