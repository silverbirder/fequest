import { test } from "@playwright/test";

import { RequestEditPage } from "./request-edit.page";

test.describe("Request edit page", () => {
  test("shows default story", async ({ page }) => {
    const requestEditPage = new RequestEditPage({ page });

    await requestEditPage.goto();
    await requestEditPage.expectDefaultStory();
  });
});
