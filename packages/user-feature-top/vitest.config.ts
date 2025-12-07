import { createBrowserConfig } from "@repo/vitest-config/browser";

export default createBrowserConfig({
  define: {
    "process.env": {},
  },
  test: {
    setupFiles: ["./vitest.setup.ts"],
  },
});
