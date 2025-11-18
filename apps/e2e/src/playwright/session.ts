import {
  type Browser,
  type BrowserContext,
  chromium,
  type Page,
} from "playwright";

export type BrowserSession = {
  browser: Browser;
  close: () => Promise<void>;
  context: BrowserContext;
  page: Page;
};

export const createBrowserSession = async (): Promise<BrowserSession> => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  return {
    browser,
    close: async () => {
      await context.close();
      await browser.close();
    },
    context,
    page,
  };
};
