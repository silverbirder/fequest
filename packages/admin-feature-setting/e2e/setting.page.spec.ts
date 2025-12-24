import { expect, test } from "@playwright/test";

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

  test("fills avatar url input", async ({ page }) => {
    const featurePage = new SettingPage({ page });

    await featurePage.goto();
    await featurePage.fillAvatarUrl("https://example.com/updated-admin.png");
    await expect(featurePage.avatarUrlInput).toHaveValue(
      "https://example.com/updated-admin.png",
    );
  });
});
