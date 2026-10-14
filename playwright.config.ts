import { defineConfig, devices } from '@playwright/test';
import { E2E_ENV, E2E_PORT, STORAGE_STATE } from './e2e/env';

/**
 * End-to-end tests run against a production build on :3103 with their own
 * MongoDB database (`noirly-algolab-e2e`, wiped before every run) and build
 * folder (`.next-e2e`), so they never touch dev data or `.next`.
 *
 *   pnpm test:e2e
 *
 * Needs MongoDB on 127.0.0.1:27017 (or set E2E_MONGODB_URI). Noirly Identity
 * is NOT needed: tests sign in with a session cookie minted from a test-only
 * AUTH_SECRET (see e2e/global-setup.ts).
 */
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : [['list'], ['html', { open: 'never' }]],
  use: {
    ...(process.env.E2E_BROWSER_CHANNEL ? { channel: process.env.E2E_BROWSER_CHANNEL } : {}),
    baseURL: `http://localhost:${E2E_PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'public', testMatch: /public\.spec\.ts/, use: { ...devices['Desktop Chrome'] } },
    {
      name: 'learner',
      testIgnore: /public\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, storageState: STORAGE_STATE },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm exec next start --port ${E2E_PORT}`,
    url: `http://localhost:${E2E_PORT}`,
    timeout: 10 * 60 * 1000,
    reuseExistingServer: !process.env.CI,
    env: E2E_ENV,
  },
});
