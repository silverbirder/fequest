import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { ProductCard } from "./product-card";
import * as stories from "./product-card.stories";

const Stories = composeStories(stories);

describe("ProductCard", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders provided children", async () => {
    await render(<ProductCard>Child content</ProductCard>);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
