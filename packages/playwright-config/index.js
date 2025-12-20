import { defineConfig } from "@playwright/test";

const basePlaywrightConfig = defineConfig({
  fullyParallel: true,
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  reporter: "list",
  testDir: "./e2e",
  use: {
    baseURL: "http://localhost:6006",
    trace: "retain-on-failure",
    viewport: { height: 720, width: 1280 },
  },
  webServer: {
    command: "pnpm --filter @repo/storybook storybook -p 6006",
    port: 6006,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

export { basePlaywrightConfig };
export default basePlaywrightConfig;
