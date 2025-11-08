import * as React from "react";
import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Box } from "./box";

describe("Box", () => {
  it("renders a div wrapper by default", async () => {
    await render(<Box className="bg-muted">Content</Box>);

    const box = document.querySelector<HTMLDivElement>('[data-slot="box"]');
    expect(box).not.toBeNull();
    expect(box?.className ?? "").toContain("bg-muted");
    expect(box?.tagName).toBe("DIV");
  });

  it("supports rendering a custom element when asChild is true", async () => {
    await render(
      <Box asChild>
        <section>Nested</section>
      </Box>,
    );

    const section = document.querySelector<HTMLElement>('[data-slot="box"]');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe("SECTION");
  });
});
