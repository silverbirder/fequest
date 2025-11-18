import type { Page } from "playwright";

import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

export class ProductPage {
  constructor(
    private readonly page: Page,
    private readonly baseUrl: string,
  ) {}

  async captureFullPageScreenshot(screenshotPath: string) {
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ fullPage: true, path: screenshotPath });
    return screenshotPath;
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
