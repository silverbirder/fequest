import { test } from "@playwright/test";

import { ProductPage } from "./product.page";

test.describe("Product page", () => {
  test("shows default feature list", async ({ page }) => {
    const productPage = new ProductPage({ page });

    await productPage.goto();
    await productPage.expectDefaultStory();
  });
});
