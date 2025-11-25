import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { RequestCard } from "./request-card";

const waitForDialog = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 0);
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
          content: "Detailed content",
          createdAt: "2024-01-01T00:00:00.000Z",
          title: "Child content",
          updatedAt: "2024-01-02T00:00:00.000Z",
        }}
        text="Child content"
      />,
    );

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
    expect(element?.textContent ?? "").toContain("CF");
  });

  it("renders footer actions when provided", async () => {
    await render(
      <RequestCard
        avatar={{ fallbackText: "CF" }}
        detail={{
          content: "Detailed content",
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
          content: "Detailed content",
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
