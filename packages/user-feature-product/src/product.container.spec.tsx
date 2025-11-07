import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { ProductContainer } from "./product.container";

describe("ProductContainer", () => {
  it("renders the component with default content", async () => {
    await render(<ProductContainer />);

    const heading = document.querySelector(
      '[data-slot="product-component"] h2',
    );
    const description = document.querySelector(
      '[data-slot="product-component"] p',
    );

    expect(heading?.textContent ?? "").toContain("Product");
    expect(description?.textContent ?? "").toContain("feature placeholder");
  });
});
