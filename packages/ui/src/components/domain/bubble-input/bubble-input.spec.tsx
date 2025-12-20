import type { ReactNode } from "react";

import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { BubbleInput } from "./bubble-input";
import * as stories from "./bubble-input.stories";

const Stories = composeStories(stories);

const renderWithIntl = (ui: ReactNode) =>
  render(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {ui}
    </NextIntlClientProvider>,
  );

describe("BubbleInput", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("accepts helper text and input props", async () => {
    await renderWithIntl(<BubbleInput helperText="送信準備" name="request" />);

    const helperNodes = Array.from(
      document.querySelectorAll('[data-slot="text"]'),
    );
    const helper = helperNodes.find((node) =>
      node.textContent?.includes("送信準備"),
    );
    expect(helper?.textContent).toBe("送信準備");

    const input = document.querySelector("input[name=request]");
    expect(input).not.toBeNull();
  });

  it("fades helper text in when the input is focused", async () => {
    await renderWithIntl(<BubbleInput helperText="フォーカス時のみ" />);

    const helperNodes = Array.from(
      document.querySelectorAll('[data-slot="text"]'),
    );
    const helper = helperNodes.find((node) =>
      node.textContent?.includes("フォーカス時のみ"),
    );
    const input = document.querySelector("input");

    expect(helper).not.toBeNull();
    expect(input).not.toBeNull();

    if (!helper || !(helper instanceof HTMLElement) || !input) return;

    expect(getComputedStyle(helper).opacity).toBe("0");

    input.focus();
    await new Promise((resolve) => setTimeout(resolve, 260));

    expect(getComputedStyle(helper).opacity).toBe("1");
  });
});
