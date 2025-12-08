import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { RequestCard } from "./request-card";
import * as stories from "./request-card.stories";

const Stories = composeStories(stories);

const waitForDialog = (delay = 0) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), delay);
  });

const openDialog = async () => {
  const trigger = document.querySelector<HTMLButtonElement>(
    "[data-slot='dialog-trigger']",
  );
  trigger?.click();
  await waitForDialog();
};

describe("RequestCard", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders provided children", async () => {
    await render(
      <RequestCard
        avatar={{ fallbackText: "CF" }}
        detail={{
          content: (
            <div>
              <h2>Heading</h2>
              <ul>
                <li>item1</li>
                <li>item2</li>
              </ul>
            </div>
          ),
          createdAt: "2024-01-01T00:00:00.000Z",
          title: "Child content",
          updatedAt: "2024-01-02T00:00:00.000Z",
        }}
        text="Child content"
      />,
    );

    await openDialog();
    await waitForDialog(25);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
    expect(element?.textContent ?? "").toContain("CF");
    const empty = document.querySelector(".mdx-empty");
    expect(empty).toBeNull();
    const headings = Array.from(document.querySelectorAll("h2"));
    const hasDetailHeading = headings.some((node) =>
      (node.textContent ?? "").includes("Heading"),
    );
    expect(hasDetailHeading).toBe(true);
  });

  it("shows emoji picker trigger when enabled", async () => {
    await render(
      <RequestCard
        avatar={{ fallbackText: "CF" }}
        detail={{
          content: (
            <div className="prose prose-slate prose-sm dark:prose-invert">
              <h2>Heading</h2>
              <ul>
                <li>item1</li>
                <li>item2</li>
              </ul>
            </div>
          ),
          createdAt: "2024-01-01T00:00:00.000Z",
          title: "Child content",
          updatedAt: "2024-01-02T00:00:00.000Z",
        }}
        enableEmojiPicker
        onReact={() => {}}
        text="Child content"
      />,
    );

    const trigger = document.querySelector<HTMLButtonElement>(
      "button[aria-label='リアクションを追加']",
    );
    expect(trigger).not.toBeNull();
  });

  it("shows closed badge when status is closed", async () => {
    await render(
      <RequestCard
        avatar={{ fallbackText: "CF" }}
        detail={{
          content: <div>内容</div>,
          createdAt: "2024-01-01T00:00:00.000Z",
          title: "完了した要望",
          updatedAt: "2024-01-02T00:00:00.000Z",
        }}
        status="closed"
        text="完了した要望"
      />,
    );

    const badge = Array.from(document.querySelectorAll("span")).find((node) =>
      (node.textContent ?? "").includes("完了"),
    );

    expect(badge).not.toBeUndefined();
  });
});
