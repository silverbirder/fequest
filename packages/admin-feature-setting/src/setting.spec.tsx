import type React from "react";

import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Setting } from "./setting";
import * as stories from "./setting.stories";

const Stories = composeStories(stories);

describe("Setting", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    const Decorator = (StoryComponent: React.ComponentType) => (
      <NextIntlClientProvider locale="ja" messages={jaMessages}>
        <StoryComponent />
      </NextIntlClientProvider>
    );

    await Story.run({
      decorators: [Decorator],
    });

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders withdrawal content", async () => {
    await render(
      <NextIntlClientProvider locale="ja" messages={jaMessages}>
        <Setting
          avatarUrl="https://example.com/avatar.png"
          onUpdateAvatar={async () => {}}
          onWithdraw={async () => {}}
        />
      </NextIntlClientProvider>,
    );

    expect(document.body.textContent).toContain("設定");
    expect(document.body.textContent).toContain("アバター画像URL");
    expect(document.body.textContent).toContain("退会");
    expect(document.body.textContent).toContain("退会する");
  });
});
