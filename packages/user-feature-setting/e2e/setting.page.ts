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

  get avatarForm(): Locator {
    return this.page.locator("form").filter({ has: this.avatarUrlInput });
  }

  get avatarImage(): Locator {
    return this.page.getByRole("img", { name: "アバター画像" });
  }

  get avatarUrlInput(): Locator {
    return this.page.getByLabel("アバター画像URL");
  }

  get hueBaseInput(): Locator {
    return this.page.getByTestId("hue-base-input");
  }

  get resetHueBaseButton(): Locator {
    return this.page.getByRole("button", { name: "リセットする" });
  }

  get updateAvatarButton(): Locator {
    return this.page.getByRole("button", { name: "更新する" });
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
    await this.page.waitForLoadState("domcontentloaded");
  }

  async expectWithdrawDialogVisible() {
    await expect(this.withdrawDialog).toBeVisible();
  }

  async fillAvatarUrl(value: string) {
    await this.avatarUrlInput.fill(value);
  }

  async goto() {
    if (this.baseUrl) {
      await this.page.goto(this.baseUrl, { waitUntil: "networkidle" });
      return;
    }

    await this.page.goto(`/iframe.html?id=${this.storyId}`, {
      waitUntil: "load",
    });
  }

  async openWithdrawDialog() {
    await this.withdrawButton.click();
    await this.expectWithdrawDialogVisible();
  }

  async resetHueBase() {
    await this.resetHueBaseButton.click();
  }

  async updateAvatar(value: string) {
    await this.fillAvatarUrl(value);
    await this.avatarForm.evaluate((form) => {
      (form as HTMLFormElement).requestSubmit();
    });
  }
}
