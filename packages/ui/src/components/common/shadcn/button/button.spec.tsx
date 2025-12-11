import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Button } from "./button";
import * as stories from "./button.stories";

const Stories = composeStories(stories);

describe("Button", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("applies default structure and variant styles", async () => {
    await render(
      <Button size="lg" variant="destructive">
        Delete
      </Button>,
    );

    const buttonEl = document.querySelector<HTMLButtonElement>(
      'button[data-slot="button"]',
    );
    expect(buttonEl).not.toBeNull();
    const className = buttonEl?.getAttribute("class") ?? "";
    expect(className).toContain("bg-destructive");
    expect(className).toContain("h-10");
  });

  it("renders a custom component when asChild is provided", async () => {
    await render(
      <Button asChild>
        <a href="/demo">Custom Link</a>
      </Button>,
    );

    const linkEl = document.querySelector<HTMLAnchorElement>(
      'a[data-slot="button"]',
    );
    expect(linkEl).not.toBeNull();
    expect(linkEl?.className ?? "").toContain("inline-flex");
  });

  it("disables and swaps label when pending", async () => {
    await render(
      <Button pending pendingLabel="Loading">
        Save
      </Button>,
    );

    const buttonEl = document.querySelector<HTMLButtonElement>(
      'button[data-slot="button"]',
    );
    expect(buttonEl?.disabled).toBe(true);
    expect(buttonEl?.textContent).toBe("Loading");
  });
});
