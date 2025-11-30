import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Box } from "./box";
import * as stories from "./box.stories";

const Stories = composeStories(stories);

describe("Box", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = "";
  });

  it("renders a div wrapper by default", async () => {
    await render(<Box className="bg-muted">Content</Box>);

    const box = document.querySelector<HTMLDivElement>('[data-slot="box"]');
    expect(box).not.toBeNull();
    expect(box?.className ?? "").toContain("bg-muted");
    expect(box?.tagName).toBe("DIV");
  });

  it("supports rendering a custom element when asChild is true", async () => {
    await render(
      <Box asChild>
        <section>Nested</section>
      </Box>,
    );

    const section = document.querySelector<HTMLElement>('[data-slot="box"]');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe("SECTION");
  });
});
