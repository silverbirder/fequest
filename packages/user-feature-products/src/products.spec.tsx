import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Products } from "./products";
import * as stories from "./products.stories";

const Stories = composeStories(stories);

describe("Products", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders each product with counts and link", async () => {
    await render(
      <Products
        products={[
          { featureCount: 2, id: 1, name: "First", reactionCount: 3 },
          { featureCount: 0, id: 2, name: "Second", reactionCount: 0 },
        ]}
      />,
    );

    const text = document.body.textContent ?? "";
    expect(text).toContain("First");
    expect(text).toContain("リクエスト 2件");
    expect(text).toContain("Second");
    expect(text).toContain("リクエスト 0件");

    const links = Array.from(document.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(links).toContain("/1");
    expect(links).toContain("/2");
  });

  it("renders empty state when no products", async () => {
    await render(<Products products={[]} />);

    const text = document.body.textContent ?? "";
    expect(text).toContain("まだ公開されているプロダクトがありません");
  });
});
