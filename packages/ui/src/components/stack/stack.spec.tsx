import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { HStack, VStack } from "./stack";

describe("Stack", () => {
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

  it("supports vertical orientation with custom spacing and alignment", async () => {
    await render(
      <VStack spacing="lg" align="center" justify="between">
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
      <HStack wrap="wrap" inline>
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
});
