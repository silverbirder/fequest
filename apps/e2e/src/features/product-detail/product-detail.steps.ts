import {
  AfterAll,
  BeforeAll,
  Given,
  setDefaultTimeout,
  Then,
  When,
} from "@cucumber/cucumber";
import { migrateDatabase } from "@repo/db/migrate";
import { stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Network, StartedNetwork, StartedTestContainer } from "testcontainers";
import { expect } from "vitest";

import { ProductPage } from "@/pages/product.page";
import {
  type BrowserSession,
  createBrowserSession,
} from "@/playwright/session";
import { createUserSession } from "@/setup/auth";
import { startDatabase, stopDatabase } from "@/setup/database";
import { type SeededProductData, seedProductData } from "@/setup/seed";
import { startUser, stopUser } from "@/setup/user";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const screenshotPath = resolve(__dirname, "product-detail-screenshot.png");
const authScreenshotPath = resolve(
  __dirname,
  "product-detail-auth-screenshot.png",
);

setDefaultTimeout(600_000);

let userStartedContainer: StartedTestContainer | undefined;
let dbStartedContainer: StartedTestContainer | undefined;
let network: StartedNetwork | undefined;
let userUrl: string | undefined;
let seededProduct: SeededProductData | undefined;
let databaseUrlForHost: string | undefined;
let authenticatedSessionToken: string | undefined;
let browserSession: BrowserSession | undefined;
let createdFeatureTitle: string | undefined;

BeforeAll(async () => {
  if (network) {
    return;
  }

  const startedNetwork = await new Network().start();
  network = startedNetwork;

  const {
    connectionString,
    container: startedDbContainer,
    hostConnectionString,
  } = await startDatabase(startedNetwork);
  dbStartedContainer = startedDbContainer;
  databaseUrlForHost = hostConnectionString;

  await migrateDatabase(hostConnectionString);

  seededProduct = await seedProductData(hostConnectionString);

  const { container: startedUserContainer, url } = await startUser(
    startedNetwork,
    connectionString,
  );
  userStartedContainer = startedUserContainer;
  userUrl = url;
});

AfterAll(async () => {
  if (browserSession) {
    await browserSession.close();
    browserSession = undefined;
  }

  await stopUser(userStartedContainer);
  await stopDatabase(dbStartedContainer);

  if (network) {
    await network.stop();
    network = undefined;
  }
});

Given("データベースにサンプルのプロダクトが存在する", () => {
  expect(seededProduct).toBeDefined();
});

Given("user アプリケーションのコンテナを起動している", () => {
  expect(userStartedContainer).toBeDefined();
});

When(/^\/\[id\] ページにアクセスしたとき$/, () => {
  expect(userUrl).toBeTruthy();
});

Then("シードされたフィーチャーを確認できる", () => {
  expect(seededProduct?.openFeatureTitle).toBeTruthy();
});

Then(
  /^Playwright で \/\[id\] ページにアクセスしてスクリーンショットを保存できる$/,
  async () => {
    if (!seededProduct || !userUrl) {
      throw new Error(
        "Seed data and app URL must be prepared before this step",
      );
    }

    const session = await createBrowserSession();

    try {
      const productPage = new ProductPage(session.page, userUrl);
      await productPage.goto(seededProduct.productId);
      await productPage.waitForFeatureRequest(seededProduct.openFeatureTitle);
      const savedPath =
        await productPage.captureFullPageScreenshot(screenshotPath);
      const fileStats = await stat(savedPath);
      expect(fileStats.size).toBeGreaterThan(0);
    } finally {
      await session.close();
    }
  },
);

Given("認証済みのユーザーセッションが存在する", async () => {
  if (!databaseUrlForHost || !seededProduct) {
    throw new Error(
      "Database and seed data must be prepared before creating a session",
    );
  }

  authenticatedSessionToken = await createUserSession(
    databaseUrlForHost,
    seededProduct.userId,
  );

  expect(authenticatedSessionToken).toBeTruthy();
});

When(
  /^認証ユーザーとして \/\[id\] ページで "([^"]+)" を投稿する$/,
  async (titleBase: string) => {
    if (!seededProduct || !userUrl || !authenticatedSessionToken) {
      throw new Error(
        "Seed data, app URL, and session token must be available",
      );
    }

    createdFeatureTitle = titleBase;
    browserSession = await createBrowserSession();

    try {
      await browserSession.context.addCookies([
        {
          domain: new URL(userUrl).hostname,
          httpOnly: true,
          name: "authjs.session-token",
          path: "/",
          sameSite: "Lax",
          secure: false,
          value: authenticatedSessionToken,
        },
      ]);

      const productPage = new ProductPage(browserSession.page, userUrl);
      await productPage.goto(seededProduct.productId);
      await productPage.createFeatureRequest(createdFeatureTitle);
    } catch (error) {
      await browserSession.close();
      browserSession = undefined;
      throw error;
    }
  },
);

Then("投稿したフィーチャーリクエストが一覧に表示される", async () => {
  if (!browserSession || !createdFeatureTitle || !userUrl) {
    throw new Error(
      "A browser session and created feature title are required for verification",
    );
  }

  try {
    const productPage = new ProductPage(browserSession.page, userUrl);
    await productPage.waitForFeatureRequest(createdFeatureTitle);
    await productPage.captureFullPageScreenshot(authScreenshotPath);
  } finally {
    await browserSession.close();
    browserSession = undefined;
  }
});
