import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { AspectRatio } from "./aspect-ratio";
import * as stories from "./aspect-ratio.stories";

const Stories = composeStories(stories);

describe("AspectRatio", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders children with enforced ratio", async () => {
    await render(
      <AspectRatio ratio={4 / 3}>
        <div id="content" />
      </AspectRatio>,
    );

    const root = document.querySelector<HTMLElement>(
      "[data-slot='aspect-ratio']",
    );
    const child = document.querySelector<HTMLElement>("#content");

    expect(root).not.toBeNull();
    expect(child?.parentElement).toBe(root);
  });
});
