import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Container } from "./container";
import * as stories from "./container.stories";

const Stories = composeStories(stories);

describe("Container", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("applies default max width and padding", async () => {
    await render(<Container>content</Container>);

    const container = document.querySelector<HTMLDivElement>(
      '[data-slot="container"]',
    );
    expect(container).not.toBeNull();

    const className = container?.className ?? "";
    expect(className).toContain("max-w-7xl");
    expect(className).toContain("px-4");
  });

  it("supports centerContent option", async () => {
    await render(<Container centerContent>Centered</Container>);

    const container = document.querySelector<HTMLDivElement>(
      '[data-slot="container"]',
    );
    expect(container).not.toBeNull();

    const className = container?.className ?? "";
    expect(className).toContain("flex");
    expect(className).toContain("items-center");
    expect(className).toContain("text-center");
  });

  it("allows custom sizing and padding variants", async () => {
    await render(
      <Container padding="none" size="sm">
        Variant
      </Container>,
    );

    const container = document.querySelector<HTMLDivElement>(
      '[data-slot="container"]',
    );
    expect(container).not.toBeNull();

    const className = container?.className ?? "";
    expect(className).toContain("max-w-xl");
    expect(className).toContain("px-0");
  });
});
