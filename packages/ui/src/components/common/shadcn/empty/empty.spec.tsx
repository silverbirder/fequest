import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";
import * as stories from "./empty.stories";

const Stories = composeStories(stories);

describe("Empty", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders default structure", async () => {
    await render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia />
          <EmptyTitle>タイトル</EmptyTitle>
          <EmptyDescription>説明テキスト</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>追加コンテンツ</EmptyContent>
      </Empty>,
    );
    const emptyEl = document.querySelector('[data-slot="empty"]');
    expect(emptyEl).not.toBeNull();
    expect(emptyEl?.className ?? "").toContain("flex");
    expect(emptyEl?.className ?? "").toContain("rounded-lg");
  });

  it("renders icon variant in EmptyMedia", async () => {
    await render(
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <svg height="24" width="24" />
          </EmptyMedia>
          <EmptyTitle>アイコン付き</EmptyTitle>
          <EmptyDescription>説明</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>追加</EmptyContent>
      </Empty>,
    );
    const iconEl = document.querySelector('[data-slot="empty-icon"]');
    expect(iconEl).not.toBeNull();
    expect(iconEl?.getAttribute("data-variant")).toBe("icon");
  });
});
