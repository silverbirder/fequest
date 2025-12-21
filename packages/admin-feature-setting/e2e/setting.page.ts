import { expect, type Locator, type Page } from "@playwright/test";

type Props = {
  baseUrl?: string;
  page: Page;
  storyId?: string;
};

export class SettingPage {
  get root(): Locator {
    return this.page.getByText("退会", { exact: false });
  }

  private readonly baseUrl?: string;

  private readonly page: Page;

  private readonly storyId: string;

  constructor(props: Props) {
    this.page = props.page;
    this.baseUrl = props.baseUrl;
    this.storyId = props.storyId ?? "feature-admin-setting--default";
  }

  async expectDefaultStory() {
    await expect(this.root).toBeVisible();
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
}
