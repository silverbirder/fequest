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
    const input = this.page.getByLabel("新しいリクエスト");
    await input.fill(title);
    await input.press("Enter");
    await this.page.waitForLoadState("networkidle");

    // Wait until the form clears so we don't confuse the typed value with an actual list item
    await this.page.waitForFunction(() => {
      const inputEl = document.querySelector<HTMLInputElement>(
        '[aria-label="新しいリクエスト"]',
      );
      return Boolean(inputEl && inputEl.value.trim() === "");
    });

    // Creating a feature may open the detail dialog via ?open=<id>; close it if present
    const dialog = this.page.getByRole("dialog");
    const dialogIsVisible = await dialog
      .isVisible({ timeout: 1_000 })
      .catch(() => false);
    if (dialogIsVisible) {
      await this.page.keyboard.press("Escape");
      await dialog.waitFor({ state: "hidden", timeout: 5_000 }).catch(() => {});
    }

    // Ensure the new request actually renders in the list
    await this.waitForFeatureRequest(title, 30_000);
  }

  async goto(productId: number) {
    await this.page.goto(`${this.baseUrl}/${productId}`, {
      waitUntil: "networkidle",
    });
  }

  async waitForFeatureRequest(title: string, timeoutMs = 60_000) {
    await this.page.waitForSelector(`text=${title}`, { timeout: timeoutMs });
  }
}
