import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { ProductComponent } from "./product.component";

describe("ProductComponent", () => {
  it("renders provided props", async () => {
    await render(
      <ProductComponent
        product={{
          id: 1,
          name: "Sample Product",
          featureRequests: [],
        }}
      />,
    );

    const section = document.querySelector('[data-slot="product-component"]');
    expect(section).not.toBeNull();
    expect(section?.textContent ?? "").toContain("Sample description");
  });
});
