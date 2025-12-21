import { expect, type Locator, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

type Props = {
  baseUrl?: string;
  page: Page;
  storyId?: string;
};

export class SettingPage {
  get root(): Locator {
    return this.page.getByRole("heading", { name: "退会" });
  }

  get withdrawButton(): Locator {
    return this.page.getByRole("button", { name: "退会する" }).first();
  }

  get withdrawConfirmButton(): Locator {
    return this.withdrawDialog.getByRole("button", { name: "退会する" });
  }

  get withdrawDialog(): Locator {
    return this.page.getByRole("alertdialog");
  }

  private readonly baseUrl?: string;

  private readonly page: Page;

  private readonly storyId: string;

  constructor(props: Props) {
    this.page = props.page;
    this.baseUrl = props.baseUrl;
    this.storyId = props.storyId ?? "feature-admin-setting--default";
  }

  async captureFullPageScreenshot(screenshotPath: string) {
    await mkdir(dirname(screenshotPath), { recursive: true });
    await this.page.screenshot({ fullPage: true, path: screenshotPath });
    return screenshotPath;
  }

  async confirmWithdraw() {
    await this.openWithdrawDialog();
    await this.withdrawConfirmButton.click();
  }

  async expectDefaultStory() {
    await expect(this.root).toBeVisible();
  }

  async expectWithdrawDialogVisible() {
    await expect(this.withdrawDialog).toBeVisible();
  }

  async goto() {
    if (this.baseUrl) {
      await this.page.goto(this.baseUrl, { waitUntil: "networkidle" });
      return;
    }

    await this.page.goto(`/iframe.html?id=${this.storyId}`, {
      waitUntil: "networkidle",
    });
  }

  async openWithdrawDialog() {
    await this.withdrawButton.click();
    await this.expectWithdrawDialogVisible();
  }
}
