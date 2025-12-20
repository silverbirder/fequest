import { test } from "@playwright/test";

import { AdminDashboardPage } from "./dashboard.page";

test.describe("Admin dashboard page", () => {
  test("shows default product list", async ({ page }) => {
    const dashboardPage = new AdminDashboardPage({ page });

    await dashboardPage.goto();
    await dashboardPage.expectDefaultStory();
  });
});
