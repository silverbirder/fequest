import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Container } from "./container";

describe("Container", () => {
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
