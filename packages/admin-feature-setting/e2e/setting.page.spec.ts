import { test } from "@playwright/test";

import { SettingPage } from "./setting.page";

test.describe("Setting page", () => {
  test("shows default story", async ({ page }) => {
    const featurePage = new SettingPage({ page });

    await featurePage.goto();
    await featurePage.expectDefaultStory();
  });

  test("opens withdraw dialog", async ({ page }) => {
    const featurePage = new SettingPage({ page });

    await featurePage.goto();
    await featurePage.openWithdrawDialog();
    await featurePage.expectWithdrawDialogVisible();
  });
});
