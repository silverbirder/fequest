import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { HStack, VStack } from "./stack";
import * as stories from "./stack.stories";

const Stories = composeStories(stories);

describe("Stack", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders a horizontal layout with centered alignment by default", async () => {
    await render(
      <HStack>
        <span>One</span>
        <span>Two</span>
      </HStack>,
    );

    const stack = document.querySelector<HTMLDivElement>('[data-slot="stack"]');
    expect(stack).not.toBeNull();
    expect(stack?.getAttribute("data-orientation")).toBe("row");

    const className = stack?.getAttribute("class") ?? "";
    expect(className).toContain("flex-row");
    expect(className).toContain("items-center");
    expect(className).toContain("gap-4");
  });

  it("supports vertical orientation with custom gap and alignment", async () => {
    await render(
      <VStack align="center" gap="lg" justify="between">
        <span>One</span>
        <span>Two</span>
      </VStack>,
    );

    const stack = document.querySelector<HTMLDivElement>('[data-slot="stack"]');
    expect(stack).not.toBeNull();
    expect(stack?.getAttribute("data-orientation")).toBe("column");

    const className = stack?.getAttribute("class") ?? "";
    expect(className).toContain("flex-col");
    expect(className).toContain("gap-6");
    expect(className).toContain("items-center");
    expect(className).toContain("justify-between");
  });

  it("allows wrapping and inline display", async () => {
    await render(
      <HStack inline wrap="wrap">
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
      </HStack>,
    );

    const stack = document.querySelector<HTMLDivElement>('[data-slot="stack"]');
    expect(stack).not.toBeNull();

    const className = stack?.getAttribute("class") ?? "";
    expect(className).toContain("flex-wrap");
    expect(className).toContain("inline-flex");
  });

  it("supports composing via asChild", async () => {
    await render(
      <HStack asChild gap="sm">
        <section data-testid="custom">content</section>
      </HStack>,
    );

    const stack = document.querySelector<HTMLElement>('[data-slot="stack"]');
    expect(stack?.tagName.toLowerCase()).toBe("section");
    expect(stack?.getAttribute("class") ?? "").toContain("gap-2");
  });
});
