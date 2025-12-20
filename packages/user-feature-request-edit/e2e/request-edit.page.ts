import { expect, type Locator, type Page } from "@playwright/test";

type Props = {
  baseUrl?: string;
  page: Page;
  storyId?: string;
};

type UpdateRequestInput = {
  content: string;
  title: string;
};

export class RequestEditPage {
  get heading(): Locator {
    return this.page.getByRole("heading", { name: "リクエストの編集" });
  }

  private readonly baseUrl?: string;

  private readonly page: Page;

  private readonly storyId: string;

  constructor(props: Props) {
    this.page = props.page;
    this.baseUrl = props.baseUrl;
    this.storyId = props.storyId ?? "feature-user-requestedit--default";
  }

  async deleteRequest() {
    await this.page.getByRole("button", { name: "リクエストを削除" }).click();
    const dialog = this.page.getByRole("alertdialog");
    await dialog.waitFor({ state: "visible", timeout: 30_000 });
    await dialog.getByRole("button", { name: "削除する" }).click();
    await this.page.waitForLoadState("networkidle");
  }

  async expectDefaultStory() {
    await expect(this.page.getByText("リクエストの編集")).toBeVisible();
    await expect(this.page.getByLabel("タイトル")).toHaveValue(
      "通知設定の改善",
    );
    await expect(this.page.getByLabel("内容")).toHaveValue(/細かな改善案/);
  }

  async goto(productId?: number, requestId?: number) {
    if (this.baseUrl) {
      if (typeof productId !== "number" || typeof requestId !== "number") {
        throw new Error(
          "productId and requestId are required when baseUrl is provided",
        );
      }

      await this.page.goto(`${this.baseUrl}/${productId}/${requestId}/edit`, {
        waitUntil: "networkidle",
      });
      return;
    }

    await this.page.goto(`/iframe.html?id=${this.storyId}`, {
      waitUntil: "networkidle",
    });
  }

  async updateRequest(input: UpdateRequestInput) {
    await this.page.getByLabel("タイトル").fill(input.title);
    await this.page.getByLabel("内容").fill(input.content);
    await this.page.getByRole("button", { name: "保存する" }).click();
    await this.page.waitForLoadState("networkidle");
  }
}
