import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Center } from "./center";
import * as stories from "./center.stories";

const Stories = composeStories(stories);

describe("Center", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = "";
  });

  it("centers children both horizontally and vertically", async () => {
    await render(
      <Center className="h-32 w-32">
        <span>Content</span>
      </Center>,
    );

    const center = document.querySelector<HTMLDivElement>(
      '[data-slot="center"]',
    );
    expect(center).not.toBeNull();
    const className = center?.className ?? "";
    expect(className).toContain("flex");
    expect(className).toContain("items-center");
    expect(className).toContain("justify-center");
  });

  it("supports inline display variant", async () => {
    await render(
      <Center inline>
        <span>Inline center</span>
      </Center>,
    );

    const center = document.querySelector<HTMLDivElement>(
      '[data-slot="center"]',
    );
    expect(center).not.toBeNull();
    expect(center?.className ?? "").toContain("inline-flex");
  });

  it("allows vertical stacking with gap", async () => {
    await render(
      <Center direction="column" gap="lg">
        <span>One</span>
        <span>Two</span>
      </Center>,
    );

    const center = document.querySelector<HTMLDivElement>(
      '[data-slot="center"]',
    );
    expect(center).not.toBeNull();

    const className = center?.className ?? "";
    expect(className).toContain("flex-col");
    expect(className).toContain("gap-6");
  });
});
