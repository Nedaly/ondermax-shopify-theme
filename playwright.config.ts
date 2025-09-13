import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:9292';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: { baseURL, trace: 'on-first-retry' },
  projects: [
    { name: 'default', use: { ...devices['Desktop Chrome'], javaScriptEnabled: true } },
    { name: 'nojs',    use: { ...devices['Desktop Chrome'], javaScriptEnabled: false } },
  ],
  // Do NOT try to read GitHub secrets here; CI will start the server.
});
