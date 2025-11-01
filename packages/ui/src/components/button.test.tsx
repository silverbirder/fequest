import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("applies default structure and variant styles", async () => {
    await render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    );

    const buttonEl = document.querySelector<HTMLButtonElement>(
      'button[data-slot="button"]',
    );
    expect(buttonEl).not.toBeNull();
    const className = buttonEl?.getAttribute("class") ?? "";
    expect(className).toContain("bg-destructive");
    expect(className).toContain("h-10");
  });

  it("renders a custom component when asChild is provided", async () => {
    await render(
      <Button asChild>
        <a href="/demo">Custom Link</a>
      </Button>,
    );

    const linkEl = document.querySelector<HTMLAnchorElement>(
      'a[data-slot="button"]',
    );
    expect(linkEl).not.toBeNull();
    expect(linkEl?.className ?? "").toContain("inline-flex");
  });
});
