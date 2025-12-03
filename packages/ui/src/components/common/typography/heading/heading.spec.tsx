import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Heading } from "./heading";
import * as stories from "./heading.stories";

const Stories = composeStories(stories);

describe("Heading", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders the correct heading level by default", async () => {
    await render(<Heading>Dashboard</Heading>);

    const element = document.querySelector<HTMLHeadingElement>(
      'h2[data-slot="heading"]',
    );
    expect(element).not.toBeNull();
    expect(element?.dataset.level).toBe("2");
    expect(element?.className ?? "").toContain("text-4xl");
  });

  it("allows changing level and composing with asChild", async () => {
    await render(
      <Heading asChild level={3} underline>
        <a href="#section">Section</a>
      </Heading>,
    );

    const element = document.querySelector<HTMLAnchorElement>(
      'a[data-slot="heading"]',
    );
    expect(element).not.toBeNull();
    expect(element?.dataset.level).toBe("3");
    expect(element?.className ?? "").toContain("underline");
  });
});
