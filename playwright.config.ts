import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['e2e.spec.ts', 'pwa-login.spec.ts', 'responsive.spec.ts', 'review-v04.spec.ts'],
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    browserName: 'chromium',
    channel: process.platform === 'win32' && !process.env.CI ? 'chrome' : undefined,
    headless: true,
    baseURL: process.env.SIGCP_TEST_BASE_URL || 'http://127.0.0.1:4173/SIGCP/',
    viewport: { width: 1440, height: 1000 },
    locale: 'fr-FR',
    timezoneId: 'Africa/Kinshasa',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    actionTimeout: 15_000,
  },
  webServer: {
    command: 'npm run preview -- --port 4173',
    url: 'http://127.0.0.1:4173/SIGCP/',
    reuseExistingServer: true,
    timeout: 90_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});






