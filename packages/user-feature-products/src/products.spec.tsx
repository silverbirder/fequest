import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Products } from "./products";

describe("Products", () => {
  it("renders provided children", async () => {
    await render(<Products>Child content</Products>);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
