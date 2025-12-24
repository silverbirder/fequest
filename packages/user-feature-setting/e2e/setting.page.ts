import { expect, type Locator, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";

type Props = {
  baseUrl?: string;
  page: Page;
  storyId?: string;
};

export class SettingPage {
  get applyHueBaseButton(): Locator {
    return this.page.getByRole("button", { name: "適用する" });
  }

  get hueBaseInput(): Locator {
    return this.page.getByTestId("hue-base-input");
  }

  get resetHueBaseButton(): Locator {
    return this.page.getByRole("button", { name: "リセットする" });
  }

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
    this.storyId = props.storyId ?? "feature-user-setting--default";
  }

  async applyHueBase(value: number) {
    await this.hueBaseInput.fill(String(value));
    await this.applyHueBaseButton.click();
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

  async resetHueBase() {
    await this.resetHueBaseButton.click();
  }
}
