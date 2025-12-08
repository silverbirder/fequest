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
import { AddressInfo, createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Network, StartedNetwork, StartedTestContainer } from "testcontainers";
import { expect } from "vitest";

import { AdminDashboardPage } from "@/pages/admin/dashboard.page";
import { AdminProductPage } from "@/pages/admin/product.page";
import { UserProductPage } from "@/pages/user/product.page";
import {
  type BrowserSession,
  createBrowserSession,
} from "@/playwright/session";
import { startAdmin, stopAdmin } from "@/setup/admin";
import { createUserSession } from "@/setup/auth";
import { startDatabase, stopDatabase } from "@/setup/database";
import { createSeedSession } from "@/setup/seed";
import { startUser, stopUser } from "@/setup/user";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const screenshotPath = resolve(__dirname, "product-detail-screenshot.png");
const authScreenshotPath = resolve(
  __dirname,
  "product-detail-auth-screenshot.png",
);

const reservePort = (preferredPort: number) =>
  new Promise<number>((resolve, reject) => {
    const server = createServer();
    server.unref();

    server.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        const fallbackServer = createServer();
        fallbackServer.unref();
        fallbackServer.once("error", reject);
        fallbackServer.listen(0, () => {
          const { port } = fallbackServer.address() as AddressInfo;
          fallbackServer.close(() => resolve(port));
        });
        return;
      }

      reject(error);
    });

    server.listen(preferredPort, () => {
      const { port } = server.address() as AddressInfo;
      server.close(() => resolve(port));
    });
  });

setDefaultTimeout(600_000);

let userStartedContainer: StartedTestContainer | undefined;
let adminStartedContainer: StartedTestContainer | undefined;
let dbStartedContainer: StartedTestContainer | undefined;
let network: StartedNetwork | undefined;
let userUrl: string | undefined;
let seededProduct:
  | undefined
  | {
      openFeatureTitle: string;
      productId: number;
      productName: string;
      userId: string;
    };
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

  const [adminHostPort, userHostPort] = await Promise.all([
    reservePort(3001),
    reservePort(3000),
  ]);

  const adminDomainUrl = `http://127.0.0.1:${adminHostPort}`;
  const userDomainUrl = `http://127.0.0.1:${userHostPort}`;

  const [
    { container: startedAdminContainer, url: adminBaseUrl },
    { container: startedUserContainer, url: userBaseUrl },
  ] = await Promise.all([
    startAdmin(startedNetwork, connectionString, {
      hostPort: adminHostPort,
      userDomainUrl,
    }),
    startUser(startedNetwork, connectionString, {
      adminDomainUrl,
      hostPort: userHostPort,
    }),
  ]);

  adminStartedContainer = startedAdminContainer;
  userStartedContainer = startedUserContainer;
  userUrl = userBaseUrl;

  const { sessionToken, userId } =
    await createSeedSession(hostConnectionString);

  const openFeatureTitle = "E2E サンプル機能";
  const closedFeatureTitle = "E2E クローズ済み機能";

  // Create product via admin UI
  const adminBrowser = await createBrowserSession();
  await adminBrowser.context.addCookies([
    {
      domain: new URL(adminBaseUrl).hostname,
      httpOnly: true,
      name: "authjs.session-token",
      path: "/",
      sameSite: "Lax",
      secure: false,
      value: sessionToken,
    },
  ]);
  const adminDashboardPage = new AdminDashboardPage(
    adminBrowser.page,
    adminBaseUrl,
  );
  await adminDashboardPage.goto();
  const { productId, productName } =
    await adminDashboardPage.createProduct("E2E Product");

  // Create features via user UI
  const userBrowser = await createBrowserSession();
  await userBrowser.context.addCookies([
    {
      domain: new URL(userBaseUrl).hostname,
      httpOnly: true,
      name: "authjs.session-token",
      path: "/",
      sameSite: "Lax",
      secure: false,
      value: sessionToken,
    },
  ]);
  const userProductPage = new UserProductPage(userBrowser.page, userBaseUrl);
  await userProductPage.goto(productId);
  await userProductPage.createFeatureRequest(openFeatureTitle);
  await userProductPage.createFeatureRequest(closedFeatureTitle);
  await userProductPage.waitForFeatureRequest(closedFeatureTitle);

  // Close one feature via admin UI
  const adminProductPage = new AdminProductPage(
    adminBrowser.page,
    adminBaseUrl,
  );
  await adminProductPage.goto(productId);
  // createFeatureRequest は2件追加しているので、2件目をクローズする
  await adminProductPage.closeFeatureAt(2);

  await adminBrowser.close();
  await userBrowser.close();

  seededProduct = {
    openFeatureTitle,
    productId,
    productName,
    userId,
  };
});

AfterAll(async () => {
  if (browserSession) {
    await browserSession.close();
    browserSession = undefined;
  }

  await stopUser(userStartedContainer);
  await stopAdmin(adminStartedContainer);
  await stopDatabase(dbStartedContainer);

  if (network) {
    await network.stop();
    network = undefined;
  }
});

Given("データベースにサンプルのプロダクトが存在する", () => {
  expect(seededProduct).toBeDefined();
});

Given("管理画面からサンプルのプロダクトが登録されている", () => {
  expect(seededProduct).toBeDefined();
});

Given("user アプリケーションのコンテナを起動している", () => {
  expect(userStartedContainer).toBeDefined();
});

Given("admin アプリケーションのコンテナを起動している", () => {
  expect(adminStartedContainer).toBeDefined();
});

When(/^\/\[id\] ページにアクセスしたとき$/, () => {
  expect(userUrl).toBeTruthy();
});

Then("登録したフィーチャーを確認できる", () => {
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
      const productPage = new UserProductPage(session.page, userUrl);
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

      const productPage = new UserProductPage(browserSession.page, userUrl);
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
    const productPage = new UserProductPage(browserSession.page, userUrl);
    await productPage.waitForFeatureRequest(createdFeatureTitle);
    await productPage.captureFullPageScreenshot(authScreenshotPath);
  } finally {
    await browserSession.close();
    browserSession = undefined;
  }
});
