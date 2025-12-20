import { defineConfig } from "@playwright/test";

const defaultPort = Number(process.env.STORYBOOK_PORT ?? 6006);
const resolvedPort = Number.isNaN(defaultPort) ? 6006 : defaultPort;
const baseUrl =
  process.env.STORYBOOK_BASE_URL ?? `http://localhost:${resolvedPort}`;

const basePlaywrightConfig = defineConfig({
  fullyParallel: true,
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
  reporter: "list",
  testDir: "./e2e",
  use: {
    baseURL: baseUrl,
    trace: "retain-on-failure",
    viewport: { height: 720, width: 1280 },
  },
  webServer: {
    command: `pnpm --filter @repo/storybook storybook -p ${resolvedPort}`,
    port: resolvedPort,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

export { basePlaywrightConfig };
export default basePlaywrightConfig;
