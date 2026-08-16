import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  timeout: 30_000,
  use: { baseURL },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /no-js\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // Verifies content is readable/usable with JavaScript disabled (FR-011, SC-005).
      name: 'no-js',
      testMatch: /no-js\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], javaScriptEnabled: false },
    },
  ],
});
