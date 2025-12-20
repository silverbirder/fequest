import { test } from "@playwright/test";

import { AdminProductPage } from "./product.page";

test.describe("Admin product page", () => {
  test("shows default feature list", async ({ page }) => {
    const productPage = new AdminProductPage({ page });

    await productPage.goto();
    await productPage.expectDefaultStory();
  });
});
