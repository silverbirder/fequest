import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Product } from "./product";

describe("Product", () => {
  it("renders provided children", async () => {
    await render(<Product>Child content</Product>);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
