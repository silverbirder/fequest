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

  it("does not render admin comment notice when slot is missing", async () => {
    await renderWithIntl(<BubbleText text="Child content" />);

    expect(document.body.textContent).not.toContain("管理者からコメントあり");
  });

  it("renders custom admin comment notice slot when provided", async () => {
    await renderWithIntl(
      <BubbleText
        adminCommentNoticeSlot={
          <button data-slot="admin-comment-notice-trigger" type="button">
            管理者からコメントあり
          </button>
        }
        text="Child content"
      />,
    );

    expect(document.body.textContent).toContain("管理者からコメントあり");
  });

  it("changes divider border color by status", async () => {
    const originalInnerHtml = document.body.innerHTML;

    await renderWithIntl(
      <BubbleText
        adminCommentNoticeSlot={
          <button data-slot="admin-comment-notice-trigger" type="button">
            管理者からコメントあり
          </button>
        }
        text="Open"
      />,
    );

    const openDivider = document.querySelector(
      '[data-slot="admin-comment-notice-divider"]',
    );
    expect(openDivider?.className ?? "").toContain("border-border");

    document.body.innerHTML = originalInnerHtml;

    await renderWithIntl(
      <BubbleText
        adminCommentNoticeSlot={
          <button data-slot="admin-comment-notice-trigger" type="button">
            管理者からコメントあり
          </button>
        }
        status="closed"
        text="Closed"
      />,
    );

    const closedDivider = document.querySelector(
      '[data-slot="admin-comment-notice-divider"]',
    );
    expect(closedDivider?.className ?? "").toContain(
      "border-muted-foreground/40",
    );
  });
});
