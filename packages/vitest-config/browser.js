import tailwindPostcss from "@tailwindcss/postcss";
import react from "@vitejs/plugin-react";
import nextjs from "vite-plugin-storybook-nextjs";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig, mergeConfig } from "vitest/config";

/**
 * Shared Vitest Browser Mode configuration blueprint.
 * @type {import("vitest/config").ViteUserConfigExport}
 */
const baseConfig = {
  css: {
    postcss: {
      plugins: [tailwindPostcss()],
    },
  },
  plugins: [react(), nextjs({dir: "../../apps/user"})],
  test: {
    include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
    setupFiles: ["@repo/vitest-config/setup"],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
};

/**
 * Factory helper so packages can extend the shared Browser Mode config.
 * @param {import("vitest/config").ViteUserConfigExport} overrides
 * @returns {import("vitest/config").ViteUserConfigExport}
 */
export const createBrowserConfig = (overrides = {}) =>
  defineConfig(mergeConfig(baseConfig, overrides));

export default defineConfig(baseConfig);
