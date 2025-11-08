import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { Product } from "./product";

describe("Product", () => {
  it("renders provided props", async () => {
    const { asFragment, baseElement } = await render(
      <Product
        product={{
          id: 1,
          name: "Sample Product",
          featureRequests: [],
        }}
        onLikeFeature={async () => {}}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    await expect.element(baseElement).toMatchScreenshot();
  });
});
