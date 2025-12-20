import type { ReactNode } from "react";

import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { BubbleText } from "./bubble-text";
import * as stories from "./bubble-text.stories";

const Stories = composeStories(stories);

const renderWithIntl = (ui: ReactNode) =>
  render(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {ui}
    </NextIntlClientProvider>,
  );

describe("BubbleText", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders provided children", async () => {
    await renderWithIntl(<BubbleText text="Child content" />);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
