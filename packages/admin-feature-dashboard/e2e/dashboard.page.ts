import { expect, type Locator, type Page } from "@playwright/test";

type Props = {
  baseUrl?: string;
  page: Page;
  storyId?: string;
};

export class AdminDashboardPage {
  get heading(): Locator {
    return this.page.getByRole("heading", { name: "プロダクト一覧" });
  }

  private readonly baseUrl?: string;

  private readonly page: Page;

  private readonly storyId: string;

  constructor(props: Props) {
    this.page = props.page;
    this.baseUrl = props.baseUrl;
    this.storyId = props.storyId ?? "feature-admin-dashboard--default";
  }

  async createProduct(name: string) {
    const createButton = this.page
      .getByRole("button", { name: "プロダクトを作成" })
      .first();
    await createButton.click();
    await this.page.getByLabel("プロダクト名").fill(name);
    await this.page.getByRole("button", { name: "作成する" }).click();
    await this.page.waitForURL("**/products/*", { waitUntil: "networkidle" });

    const currentUrl = new URL(this.page.url());
    const productId = Number(currentUrl.pathname.split("/").pop());

    if (Number.isNaN(productId)) {
      throw new Error("Failed to read created product id from admin UI");
    }

    const productName = await this.page.getByLabel("プロダクト名").inputValue();

    return { productId, productName };
  }

  async expectDefaultStory() {
    await expect(this.heading).toBeVisible();
    await expect(this.page.getByText("Alpha", { exact: true })).toBeVisible();
    await expect(this.page.getByText("Beta", { exact: true })).toBeVisible();
  }

  async expectProductListed(name: string) {
    await expect(
      this.page.getByRole("link", { name: `${name}のプロダクトページ` }),
    ).toBeVisible();
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
