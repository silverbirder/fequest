import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Product } from "./product";

describe("Product", () => {
  it("renders provided props", async () => {
    const { asFragment, baseElement } = await render(
      <Product
        onLikeFeature={async () => {}}
        product={{
          featureRequests: [],
          id: 1,
          name: "Sample Product",
        }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    await expect.element(baseElement).toMatchScreenshot();
  });
});
