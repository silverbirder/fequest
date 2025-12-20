import "@repo/ui/globals.css";
import type { Preview } from "@storybook/nextjs-vite";

import { jaMessages } from "@repo/messages";
import { Providers } from "@repo/ui/providers/theme-provider";
import { NextIntlClientProvider } from "next-intl";

const preview: Preview = {
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ja" messages={jaMessages}>
        <Providers>
          <Story />
        </Providers>
      </NextIntlClientProvider>
    ),
  ],
};

export default preview;
