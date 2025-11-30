import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestContentEditor } from "./feature-request-content-editor";
import * as stories from "./feature-request-content-editor.stories";

const Stories = composeStories(stories);

describe("FeatureRequestContentEditor", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = "";
  });

  it("renders nothing when no update handler is provided", async () => {
    await render(<FeatureRequestContentEditor content="hi" featureId={1} />);

    const html = document.body.textContent ?? "";
    expect(html.trim()).toBe("");
  });

  it("shows edit button and toggles to form on click", async () => {
    const mockHandler = vi.fn(async () => {});

    await render(
      <FeatureRequestContentEditor
        content="Initial content"
        featureId={5}
        onUpdateFeatureRequest={mockHandler}
      />,
    );

    const button = document.querySelector<HTMLButtonElement>("button");
    expect(button?.textContent).toContain("編集");

    button!.click();
    // wait a tick for state update
    await new Promise((r) => setTimeout(r, 0));

    const textarea = document.querySelector<HTMLTextAreaElement>(
      "textarea[name=content]",
    );
    expect(textarea).toBeTruthy();
    expect(textarea?.value).toBe("Initial content");

    const saveButton = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("保存"),
    );
    expect(saveButton).toBeDefined();

    const cancelButton = Array.from(document.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("取消"),
    );
    expect(cancelButton).toBeDefined();

    // Cancel should close editor
    cancelButton!.click();
    // wait a tick for state update
    await new Promise((r) => setTimeout(r, 0));
    const htmlAfter = document.body.textContent ?? "";
    expect(htmlAfter).toContain("編集");
  });
});
