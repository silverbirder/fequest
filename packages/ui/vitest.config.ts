import { createBrowserConfig } from "@repo/vitest-config/browser";

export default createBrowserConfig({
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
});
