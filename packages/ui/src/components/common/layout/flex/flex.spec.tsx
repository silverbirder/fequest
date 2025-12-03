import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Flex } from "./flex";
import * as stories from "./flex.stories";

const Stories = composeStories(stories);

describe("Flex", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders as a flex container with default row layout", async () => {
    await render(
      <Flex>
        <span>One</span>
        <span>Two</span>
      </Flex>,
    );

    const flex = document.querySelector<HTMLDivElement>('[data-slot="flex"]');
    expect(flex).not.toBeNull();

    const className = flex?.className ?? "";
    expect(className).toContain("flex");
    expect(className).toContain("flex-row");
    expect(className).toContain("gap-2");
  });

  it("supports custom alignment, justification, and wrapping", async () => {
    await render(
      <Flex align="center" justify="between" wrap="wrap">
        <span>One</span>
        <span>Two</span>
      </Flex>,
    );

    const flex = document.querySelector<HTMLDivElement>('[data-slot="flex"]');
    expect(flex).not.toBeNull();

    const className = flex?.className ?? "";
    expect(className).toContain("items-center");
    expect(className).toContain("justify-between");
    expect(className).toContain("flex-wrap");
  });

  it("allows inline display and column direction via Slot", async () => {
    await render(
      <Flex asChild direction="column" gap="lg" inline>
        <section>
          <span>One</span>
          <span>Two</span>
        </section>
      </Flex>,
    );

    const section = document.querySelector<HTMLElement>('[data-slot="flex"]');
    expect(section).not.toBeNull();

    const className = section?.className ?? "";
    expect(className).toContain("inline-flex");
    expect(className).toContain("flex-col");
    expect(className).toContain("gap-6");
    expect(section?.tagName).toBe("SECTION");
  });
});
