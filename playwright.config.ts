import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end configuration.
 *
 * The suite runs against a production build (`next start`) on port 3123. It is deliberately kept
 * small: it proves the public journeys and the administrative gate really work in a browser, not
 * just over curl. Screenshots and videos are written to ./test-results, which is excluded from the
 * delivered archive.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3123",
    trace: "off",
    screenshot: "only-on-failure",
    ...devices["Desktop Chrome"],
  },
});
