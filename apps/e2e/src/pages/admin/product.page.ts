import type { Page } from "playwright";

export class AdminProductPage {
  constructor(
    private readonly page: Page,
    private readonly baseUrl: string,
  ) {}

  async closeFeatureAt(position: number) {
    if (position < 1) {
      throw new Error("position must be >= 1");
    }

    const index = position - 1;
    const statusForms = this.page.locator('[data-slot="feature-status-form"]');
    await statusForms.nth(index).waitFor({ state: "visible", timeout: 30_000 });

    const closeButton = statusForms
      .nth(index)
      .getByRole("button", { name: "クローズにする" });

    await closeButton.click({ timeout: 30_000 });
    await this.page.waitForLoadState("networkidle");
  }

  async goto(productId: number) {
    await this.page.goto(`${this.baseUrl}/products/${productId}`, {
      waitUntil: "networkidle",
    });
  }
}
