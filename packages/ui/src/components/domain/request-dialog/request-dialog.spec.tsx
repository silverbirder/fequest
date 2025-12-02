import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { RequestDialog } from "./request-dialog";
import * as stories from "./request-dialog.stories";

const Stories = composeStories(stories);

const waitForDialog = (delay = 0) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), delay);
  });

const openDialog = async (label: string) => {
  const trigger = document.querySelector<HTMLButtonElement>(
    `button[aria-label='${label}']`,
  );
  trigger?.click();
  await waitForDialog();
};

describe("RequestDialog", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = "";
  });

  it("renders provided detail content and metadata", async () => {
    await render(
      <RequestDialog
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
        dialogTitle="Child content"
        dialogTriggerLabel="Open detail"
      />,
    );

    await openDialog("Open detail");

    const bodyText = document.body.textContent ?? "";
    expect(bodyText).toContain("Child content");
    expect(bodyText).toContain(
      "CFChild contentHeadingitem1item2投稿日: 2024/01/01 9:00Close",
    );
    const heading = document.querySelector(".prose h2");
    expect(heading?.textContent ?? "").toContain("Heading");
  });

  it("renders footer action when provided", async () => {
    await render(
      <RequestDialog
        avatar={{ fallbackText: "CF" }}
        detail={{
          content: (
            <div className="prose prose-slate prose-sm dark:prose-invert">
              <h2>Heading</h2>
            </div>
          ),
          createdAt: "2024-01-01T00:00:00.000Z",
          title: "Child content",
          updatedAt: "2024-01-02T00:00:00.000Z",
        }}
        dialogTitle="Child content"
        dialogTriggerLabel="Open detail"
        footerAction={{
          action: async () => {},
          fields: { featureId: 1 },
          label: "カスタムアクション",
        }}
      />,
    );

    await openDialog("Open detail");

    const footer = document.querySelector("[data-slot='dialog-footer']");
    expect(footer?.textContent ?? "").toContain("投稿日: 2024/01/01 9:00");
  });
});
