import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Text } from "./text";

describe("Text", () => {
  it("renders a span with typography variants", async () => {
    await render(
      <Text size="xl" weight="semibold" color="accent">
        Hello
      </Text>,
    );

    const element = document.querySelector<HTMLSpanElement>(
      'span[data-slot="text"]',
    );
    expect(element).not.toBeNull();
    const className = element?.getAttribute("class") ?? "";
    expect(className).toContain("text-xl");
    expect(className).toContain("font-semibold");
    expect(className).toContain("text-primary");
  });

  it("supports composing via asChild", async () => {
    await render(
      <Text asChild casing="uppercase">
        <p>composed</p>
      </Text>,
    );

    const element = document.querySelector<HTMLParagraphElement>(
      'p[data-slot="text"]',
    );
    expect(element).not.toBeNull();
    expect(element?.className ?? "").toContain("uppercase");
  });
});
