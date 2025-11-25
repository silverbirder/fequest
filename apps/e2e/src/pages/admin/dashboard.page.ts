import type { Page } from "playwright";

export class AdminDashboardPage {
  constructor(
    private readonly page: Page,
    private readonly baseUrl: string,
  ) {}

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

  async goto() {
    await this.page.goto(this.baseUrl, { waitUntil: "networkidle" });
  }
}
