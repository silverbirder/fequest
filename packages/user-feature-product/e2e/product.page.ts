import { expect, type Locator, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

type ProductDetails = {
  description: string;
  homePageUrl: string;
  name: string;
};

const detailLabelSuffix = "の詳細を表示";

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

  async expectEditButtonHidden(title: string) {
    await this.openFeatureDetail(title);
    await expect(
      this.page
        .getByRole("dialog")
        .getByRole("link", { name: "編集ページを開く" }),
    ).toHaveCount(0);
    await this.page.keyboard.press("Escape");
    await this.page.getByRole("dialog").waitFor({ state: "hidden" });
  }

  async expectEditButtonVisible(title: string) {
    await this.openFeatureDetail(title);
    await expect(
      this.page
        .getByRole("dialog")
        .getByRole("link", { name: "編集ページを開く" }),
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

  async getFeatureTitlesInDisplayOrder() {
    const labels = await this.page
      .locator('button[data-slot="dialog-trigger"]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("aria-label") ?? ""),
      );

    return labels.map((label) => {
      if (!label.endsWith(detailLabelSuffix)) return label.trim();
      return label.slice(0, -detailLabelSuffix.length).trim();
    });
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

  async openEditPage(title: string) {
    await this.openFeatureDetail(title);
    await this.page
      .getByRole("dialog")
      .getByRole("link", { name: "編集ページを開く" })
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  async openFeatureDetail(title: string) {
    await this.page
      .getByRole("button", { name: `${title}${detailLabelSuffix}` })
      .click();
    await this.page.getByRole("dialog").waitFor({ state: "visible" });
    await this.waitForDialogAnimation();
  }

  async waitForFeatureRequest(title: string, timeoutMs = 60_000) {
    await this.page.waitForSelector(`text=${title}`, { timeout: timeoutMs });
  }

  async waitForFeatureRequestToDisappearWithReload(
    title: string,
    timeoutMs = 60_000,
    reloadIntervalMs = 5_000,
  ) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const found = await this.page
        .getByText(title, { exact: true })
        .isVisible()
        .catch(() => false);
      if (!found) {
        return;
      }
      await this.page.waitForTimeout(reloadIntervalMs);
      await this.page.reload({ waitUntil: "networkidle" });
    }

    throw new Error(`Timed out waiting for feature to disappear: ${title}`);
  }

  async waitForFeatureRequestWithReload(
    title: string,
    timeoutMs = 60_000,
    reloadIntervalMs = 5_000,
  ) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const found = await this.page
        .getByText(title, { exact: true })
        .isVisible()
        .catch(() => false);
      if (found) {
        return;
      }
      await this.page.waitForTimeout(reloadIntervalMs);
      await this.page.reload({ waitUntil: "networkidle" });
    }

    throw new Error(`Timed out waiting for feature: ${title}`);
  }

  private async waitForDialogAnimation() {
    await this.page.waitForFunction(
      () => {
        const elements = Array.from(
          document.querySelectorAll(
            "[data-slot='dialog-content'], [data-slot='dialog-overlay']",
          ),
        );
        if (elements.length === 0) {
          return true;
        }
        return elements.every((element) => {
          const animations = element.getAnimations?.() ?? [];
          if (animations.length === 0) {
            return true;
          }
          return animations.every(
            (animation) => animation.playState === "finished",
          );
        });
      },
      { timeout: 2_000 },
    );
  }
}
