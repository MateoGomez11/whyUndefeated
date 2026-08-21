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
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
    },
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
