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
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders provided detail content and metadata", async () => {
    await render(
      <RequestDialog
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
        dialogTitle="Child content"
        dialogTriggerLabel="Open detail"
      />,
    );

    await openDialog("Open detail");

    const bodyText = document.body.textContent ?? "";
    expect(bodyText).toContain("Child content");
    expect(bodyText).toContain(
      "CFChild contentHeadingitem1item2投稿日: 2024年01月01日Close",
    );
    const headings = Array.from(document.querySelectorAll("h2"));
    const hasDetailHeading = headings.some((node) =>
      (node.textContent ?? "").includes("Heading"),
    );
    expect(hasDetailHeading).toBe(true);
  });

  it("opens by default when defaultOpen is true", async () => {
    await render(
      <RequestDialog
        avatar={{ fallbackText: "CF" }}
        defaultOpen
        detail={{
          content: <p>Auto open content</p>,
          createdAt: "2024-01-01T00:00:00.000Z",
          title: "自動で開く",
        }}
        dialogTitle="自動で開く"
        dialogTriggerLabel="Open detail"
      />,
    );

    await waitForDialog();

    expect(document.body.textContent ?? "").toContain("Auto open content");
  });
});
