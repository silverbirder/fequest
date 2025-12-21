import {
  After,
  AfterAll,
  BeforeAll,
  Given,
  setDefaultTimeout,
  Then,
  When,
} from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { AdminDashboardPage } from "@repo/admin-feature-dashboard/e2e";
import { AdminProductPage } from "@repo/admin-feature-product/e2e";
import {
  adminSessions,
  adminUsers,
  createDbClient,
  products,
  resetCachedConnection,
} from "@repo/db";
import { migrateDatabase } from "@repo/db/migrate";
import { randomUUID } from "node:crypto";
import { mkdir, stat } from "node:fs/promises";
import { AddressInfo, createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Network, StartedNetwork, StartedTestContainer } from "testcontainers";

import {
  type BrowserSession,
  createBrowserSession,
} from "@/playwright/session";
import { startAdmin, stopAdmin } from "@/setup/admin";
import { startDatabase, stopDatabase } from "@/setup/database";
import { startUser, stopUser } from "@/setup/user";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type SeededProduct = {
  id: number;
  name: string;
};

let userStartedContainer: StartedTestContainer | undefined;
let adminStartedContainer: StartedTestContainer | undefined;
let dbStartedContainer: StartedTestContainer | undefined;
let network: StartedNetwork | undefined;
let userUrl: string | undefined;
let adminUrl: string | undefined;

let ownerSessionToken: string | undefined;
let seededProduct: SeededProduct | undefined;
let otherProduct: SeededProduct | undefined;

let scenarioSession: BrowserSession | undefined;
let cleanupStarted = false;

const createAdminSeedSession = async (databaseUrlForHost: string) => {
  const db = createDbClient({
    databaseUrl: databaseUrlForHost,
    nodeEnv: "test",
  });
  const userId = `e2e-admin-${randomUUID()}`;
  const sessionToken = `e2e-admin-session-${randomUUID()}`;

  await db.insert(adminUsers).values({
    email: `${userId}@example.com`,
    id: userId,
    name: "E2E Admin",
  });

  await db.insert(adminSessions).values({
    expires: new Date(Date.now() + 1000 * 60 * 60),
    sessionToken,
    userId,
  });

  return { sessionToken, userId };
};

const waitForNotFound = async (
  page: BrowserSession["page"],
  url: string,
  timeoutMs = 60_000,
  intervalMs = 3_000,
) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    await page.goto(url, { waitUntil: "networkidle" });
    const visible = await page
      .getByText("404 - Not Found")
      .isVisible()
      .catch(() => false);
    if (visible) {
      return;
    }
    await page.waitForTimeout(intervalMs);
  }

  throw new Error(`Timed out waiting for 404: ${url}`);
};

const cleanup = async () => {
  if (cleanupStarted) {
    return;
  }
  cleanupStarted = true;

  if (scenarioSession) {
    await scenarioSession.close();
    scenarioSession = undefined;
  }

  await Promise.allSettled([
    stopUser(userStartedContainer).then(() => {
      userStartedContainer = undefined;
    }),
    stopAdmin(adminStartedContainer).then(() => {
      adminStartedContainer = undefined;
    }),
    stopDatabase(dbStartedContainer).then(() => {
      dbStartedContainer = undefined;
    }),
  ]);

  if (network) {
    await network.stop();
    network = undefined;
  }
};

const registerCleanupHandlers = () => {
  const handleSignal = async (signal: NodeJS.Signals) => {
    try {
      await cleanup();
    } finally {
      process.removeListener(signal, handleSignal);
      process.kill(process.pid, signal);
    }
  };

  process.once("SIGINT", handleSignal);
  process.once("SIGTERM", handleSignal);
};

registerCleanupHandlers();

const createAdminBrowser = async (sessionToken: string) => {
  if (!adminUrl) {
    throw new Error("Admin URL must be prepared before creating sessions");
  }

  const session = await createBrowserSession();
  const domain = new URL(adminUrl).hostname;
  await session.context.addCookies([
    {
      domain,
      httpOnly: true,
      name: "authjs.session-token",
      path: "/",
      sameSite: "Lax",
      secure: false,
      value: sessionToken,
    },
    {
      domain,
      httpOnly: true,
      name: "fequest-admin-authjs.session-token",
      path: "/",
      sameSite: "Lax",
      secure: false,
      value: sessionToken,
    },
  ]);

  return session;
};

BeforeAll(async () => {
  if (network) {
    return;
  }

  try {
    const startedNetwork = await new Network().start();
    network = startedNetwork;

    const {
      connectionString,
      container: startedDbContainer,
      hostConnectionString,
    } = await startDatabase(startedNetwork);
    dbStartedContainer = startedDbContainer;

    resetCachedConnection();
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
    adminUrl = adminBaseUrl;
    userUrl = userBaseUrl;

    const { sessionToken } = await createAdminSeedSession(hostConnectionString);
    ownerSessionToken = sessionToken;

    const adminBrowser = await createAdminBrowser(sessionToken);
    const adminDashboardPage = new AdminDashboardPage({
      baseUrl: adminBaseUrl,
      page: adminBrowser.page,
    });
    await adminDashboardPage.goto();
    const { productId, productName } =
      await adminDashboardPage.createProduct("E2E Admin Product");
    seededProduct = { id: productId, name: productName };

    const { userId: otherUserId } =
      await createAdminSeedSession(hostConnectionString);
    const db = createDbClient({
      databaseUrl: hostConnectionString,
      nodeEnv: "test",
    });
    const [otherRecord] = await db
      .insert(products)
      .values({
        name: "E2E Other Product",
        userId: otherUserId,
      })
      .returning({ id: products.id, name: products.name });

    if (!otherRecord) {
      throw new Error("Failed to create other user's product");
    }

    otherProduct = { id: otherRecord.id, name: otherRecord.name };

    await adminBrowser.close();
  } catch (error) {
    await cleanup();
    throw error;
  }
});

AfterAll(async () => {
  await cleanup();
});

After(async () => {
  if (scenarioSession) {
    await scenarioSession.close();
    scenarioSession = undefined;
  }
});

Given("admin アプリのコンテナを起動している", () => {
  expect(adminStartedContainer).toBeDefined();
});

Given("admin と user アプリのコンテナを起動済みである", () => {
  expect(adminStartedContainer).toBeDefined();
  expect(userStartedContainer).toBeDefined();
});

Given("検証用プロダクトが管理画面に登録済みである", () => {
  expect(seededProduct).toBeDefined();
});

Given("管理画面に他ユーザーのプロダクトが存在する", () => {
  expect(otherProduct).toBeDefined();
});

When("管理画面のトップページを開いたとき", async () => {
  if (!ownerSessionToken || !adminUrl) {
    throw new Error("Owner session and admin URL must be prepared");
  }

  scenarioSession = await createAdminBrowser(ownerSessionToken);
  const adminDashboardPage = new AdminDashboardPage({
    baseUrl: adminUrl,
    page: scenarioSession.page,
  });
  await adminDashboardPage.goto();
});

Then("登録したプロダクトが一覧に表示される", async () => {
  if (!scenarioSession || !seededProduct || !adminUrl) {
    throw new Error("Scenario session and seeded product must be prepared");
  }

  const adminDashboardPage = new AdminDashboardPage({
    baseUrl: adminUrl,
    page: scenarioSession.page,
  });
  await adminDashboardPage.expectProductListed(seededProduct.name);
});

When("他ユーザーのプロダクト管理ページを開いたとき", async () => {
  if (!ownerSessionToken || !adminUrl || !otherProduct) {
    throw new Error("Owner session and other product must be prepared");
  }

  scenarioSession = await createAdminBrowser(ownerSessionToken);
  const adminProductPage = new AdminProductPage({
    baseUrl: adminUrl,
    page: scenarioSession.page,
  });
  await adminProductPage.goto(otherProduct.id);
});

Then("管理画面で404が表示される", async () => {
  if (!scenarioSession) {
    throw new Error("Scenario session must be prepared");
  }

  await expect(scenarioSession.page.getByText("404 - Not Found")).toBeVisible();
});

When("管理画面でプロダクトを削除する", async () => {
  if (!ownerSessionToken || !adminUrl || !seededProduct) {
    throw new Error("Owner session and product must be prepared");
  }

  scenarioSession = await createAdminBrowser(ownerSessionToken);
  const adminProductPage = new AdminProductPage({
    baseUrl: adminUrl,
    page: scenarioSession.page,
  });
  await adminProductPage.goto(seededProduct.id);
  await adminProductPage.deleteProduct();
});

Then("管理画面で当該プロダクトページが404になる", async () => {
  if (!scenarioSession || !adminUrl || !seededProduct) {
    throw new Error("Scenario session and product must be prepared");
  }

  await waitForNotFound(
    scenarioSession.page,
    `${adminUrl}/products/${seededProduct.id}`,
  );
});

Then("ユーザー画面で当該プロダクトページが404になる", async () => {
  if (!userUrl || !seededProduct) {
    throw new Error("User URL and product must be prepared");
  }

  const session = await createBrowserSession();
  try {
    await waitForNotFound(session.page, `${userUrl}/${seededProduct.id}`);
  } finally {
    await session.close();
  }
});

Then(
  /^Playwright で管理画面の "([^"]+)" のスクリーンショットを保存できる$/,
  async (fileName: string) => {
    if (!scenarioSession) {
      throw new Error("Scenario session must be available");
    }

    const screenshotPath = resolve(__dirname, fileName);
    await mkdir(dirname(screenshotPath), { recursive: true });
    await scenarioSession.page.screenshot({
      fullPage: true,
      path: screenshotPath,
    });
    const fileStats = await stat(screenshotPath);
    expect(fileStats.size).toBeGreaterThan(0);
  },
);
