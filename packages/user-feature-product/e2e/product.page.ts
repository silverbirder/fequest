import { expect, type Locator, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

type ProductDetails = {
  description: string;
  homePageUrl: string;
  name: string;
};

type Props = {
  baseUrl?: string;
  page: Page;
  storyId?: string;
};

export class ProductPage {
  get heading(): Locator {
    return this.page.getByRole("heading", { name: "サンプルプロダクト" });
  }
  get requestInput(): Locator {
    return this.page.getByLabel("新しいリクエスト");
  }
  private readonly baseUrl?: string;

  private readonly page: Page;

  private readonly storyId: string;

  constructor(props: Props) {
    this.page = props.page;
    this.baseUrl = props.baseUrl;
    this.storyId = props.storyId ?? "feature-user-product--default";
  }

  async captureFullPageScreenshot(screenshotPath: string) {
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ fullPage: true, path: screenshotPath });
    return screenshotPath;
  }

  async createFeatureRequest(title: string) {
    const input = this.requestInput;
    await input.fill(title);
    await input.press("Enter");
    await this.page.waitForLoadState("networkidle");

    await this.page.waitForFunction(() => {
      const inputEl = document.querySelector<HTMLInputElement>(
        '[aria-label="新しいリクエスト"]',
      );
      return Boolean(inputEl && inputEl.value.trim() === "");
    });

    const dialog = this.page.getByRole("dialog");
    const dialogIsVisible = await dialog
      .isVisible({ timeout: 1_000 })
      .catch(() => false);
    if (dialogIsVisible) {
      await this.page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden", timeout: 5_000 }).catch(() => {});
    }

    await this.waitForFeatureRequest(title, 30_000);
  }

  async expectDefaultStory() {
    await expect(this.heading).toBeVisible();
    await expect(
      this.featureRequest("プロフィール画像アップロード"),
    ).toBeVisible();
    await expect(
      this.featureRequest("管理ダッシュボードのフィルター"),
    ).toBeVisible();
  }

  async expectProductDetails(details: ProductDetails) {
    await expect(
      this.page.getByRole("heading", { name: details.name }),
    ).toBeVisible();
    await expect(this.page.getByAltText(`${details.name}のロゴ`)).toBeVisible();
    await expect(
      this.page.getByRole("link", { name: "公式サイト" }),
    ).toHaveAttribute("href", details.homePageUrl);
    await expect(this.page.getByText(details.description)).toBeVisible();
  }

  featureRequest(title: string): Locator {
    return this.page.getByText(title, { exact: true });
  }

  async goto(productId?: number) {
    if (this.baseUrl) {
      if (typeof productId !== "number") {
        throw new Error("productId is required when baseUrl is provided");
      }

      await this.page.goto(`${this.baseUrl}/${productId}`, {
        waitUntil: "networkidle",
      });
      return;
    }

    await this.page.goto(`/iframe.html?id=${this.storyId}`, {
      waitUntil: "networkidle",
    });
  }

  async waitForFeatureRequest(title: string, timeoutMs = 60_000) {
    await this.page.waitForSelector(`text=${title}`, { timeout: timeoutMs });
  }
}
