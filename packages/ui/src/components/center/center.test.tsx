import * as React from "react";
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Center } from "./center";

describe("Center", () => {
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

  it("allows vertical stacking with spacing", async () => {
    await render(
      <Center direction="column" spacing="lg">
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
