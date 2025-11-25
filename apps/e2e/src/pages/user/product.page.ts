import type { Page } from "playwright";

import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export class UserProductPage {
  constructor(
    private readonly page: Page,
    private readonly baseUrl: string,
  ) {}

  async captureFullPageScreenshot(screenshotPath: string) {
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ fullPage: true, path: screenshotPath });
    return screenshotPath;
  }

  async createFeatureRequest(title: string) {
    const input = this.page.getByLabel("新しいフィーチャーリクエスト");
    await input.fill(title);
    await input.press("Enter");
    await this.page.waitForLoadState("networkidle");
  }

  async goto(productId: number) {
    await this.page.goto(`${this.baseUrl}/${productId}`, {
      waitUntil: "networkidle",
    });
  }

  async waitForFeatureRequest(title: string) {
    await this.page.waitForSelector(`text=${title}`, { timeout: 15_000 });
  }
}
