import "@repo/ui/globals.css";
import type { Preview } from "@storybook/nextjs-vite";

import { Toaster } from "@repo/ui/components";
import { Providers } from "@repo/ui/providers/theme-provider";

const preview: Preview = {
  decorators: [
    (Story) => (
      <Providers>
        <Story />
        <Toaster />
      </Providers>
    ),
  ],
  parameters: {
    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "error",
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
