import { defineConfig, devices } from "@playwright/test";

/**
 * Production smoke (DoD / cutover). Override with env:
 *   WEB_URL, CMS_URL, API_CF_URL, API_CMS_URL
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 45_000,
  expect: { timeout: 15_000 },
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    userAgent: "teknovo-playwright-smoke/1.0",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
