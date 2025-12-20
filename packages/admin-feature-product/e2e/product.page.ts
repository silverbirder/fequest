import { expect, type Locator, type Page } from "@playwright/test";

type ProductDetails = {
  description: string;
  homePageUrl: string;
  logoUrl: string;
};

type Props = {
  baseUrl?: string;
  page: Page;
  storyId?: string;
};

export class AdminProductPage {
  get heading(): Locator {
    return this.page.getByRole("heading", { name: "プロダクトの管理" });
  }

  private readonly baseUrl?: string;

  private readonly page: Page;

  private readonly storyId: string;

  constructor(props: Props) {
    this.page = props.page;
    this.baseUrl = props.baseUrl;
    this.storyId = props.storyId ?? "feature-admin-product--default";
  }

  async closeFeatureAt(position: number) {
    if (position < 1) {
      throw new Error("position must be >= 1");
    }

    const index = position - 1;
    const statusForms = this.page.locator('[data-slot="feature-status-form"]');
    await statusForms.nth(index).waitFor({ state: "visible", timeout: 30_000 });

    const closeButton = statusForms
      .nth(index)
      .getByRole("button", { name: "完了にする" });

    await closeButton.click({ timeout: 30_000 });
    await this.page.waitForLoadState("networkidle");
  }

  async expectDefaultStory() {
    await expect(this.heading).toBeVisible();
    await expect(this.featureRequest("アルファ版での改善点")).toBeVisible();
    await expect(this.featureRequest("通知機能はありますか？")).toBeVisible();
  }

  featureRequest(title: string): Locator {
    return this.page.getByText(title, { exact: true });
  }

  async goto(productId?: number) {
    if (this.baseUrl) {
      if (typeof productId !== "number") {
        throw new Error("productId is required when baseUrl is provided");
      }

      await this.page.goto(`${this.baseUrl}/products/${productId}`, {
        waitUntil: "networkidle",
      });
      return;
    }

    await this.page.goto(`/iframe.html?id=${this.storyId}`, {
      waitUntil: "networkidle",
    });
  }

  async updateDetails(details: ProductDetails) {
    const detailsForm = this.page.locator('[data-slot="details-form"]');
    await detailsForm.waitFor({ state: "visible", timeout: 30_000 });

    await this.page.getByLabel("プロダクトロゴURL").fill(details.logoUrl);
    await this.page
      .getByLabel("プロダクトホームページURL")
      .fill(details.homePageUrl);
    await this.page.getByLabel("プロダクト説明文").fill(details.description);

    await detailsForm.getByRole("button", { name: "表示情報を保存" }).click();
    await this.page.waitForLoadState("networkidle");
  }
}
