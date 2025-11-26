import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { RequestCard } from "./request-card";

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
  it("renders provided children", async () => {
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
    const heading = document.querySelector(".prose h2");
    expect(heading?.textContent ?? "").toContain("Heading");
  });

  it("renders footer actions when provided", async () => {
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
        footerActions={<span>カスタムアクション</span>}
        text="Child content"
      />,
    );

    await openDialog();

    const footer = document.querySelector("[data-slot='dialog-footer']");
    expect(footer?.textContent ?? "").toContain("カスタムアクション");
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
});
