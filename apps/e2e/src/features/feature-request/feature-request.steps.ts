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
  createDbClient,
  featureRequestReactions,
  featureRequests,
  resetCachedConnection,
} from "@repo/db";
import { migrateDatabase } from "@repo/db/migrate";
import { ProductPage as UserProductPage } from "@repo/user-feature-product/e2e";
import { RequestEditPage } from "@repo/user-feature-request-edit/e2e";
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
import { createSeedSession } from "@/setup/seed";
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

type SeededFeature = {
  content: string;
  id: number;
  title: string;
};

type SeededProduct = {
  id: number;
  name: string;
};

let userStartedContainer: StartedTestContainer | undefined;
let adminStartedContainer: StartedTestContainer | undefined;
let dbStartedContainer: StartedTestContainer | undefined;
let network: StartedNetwork | undefined;
let userUrl: string | undefined;

let ownerSessionToken: string | undefined;
let ownerUserId: string | undefined;
let otherSessionToken: string | undefined;
let seededProduct: SeededProduct | undefined;
let seededFeatures:
  | undefined
  | {
      closed: SeededFeature;
      deletable: SeededFeature;
      editable: SeededFeature;
      nonOwner: SeededFeature;
      orderHigh: SeededFeature;
      orderSameNew: SeededFeature;
      orderSameOld: SeededFeature;
      reaction: SeededFeature;
    };

let scenarioSession: BrowserSession | undefined;
let cleanupStarted = false;

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

const createAuthenticatedBrowser = async (sessionToken: string) => {
  if (!userUrl) {
    throw new Error("User URL must be prepared before creating sessions");
  }

  const session = await createBrowserSession();
  await session.context.addCookies([
    {
      domain: new URL(userUrl).hostname,
      httpOnly: true,
      name: "authjs.session-token",
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
    userUrl = userBaseUrl;

    const { sessionToken, userId } =
      await createSeedSession(hostConnectionString);
    ownerSessionToken = sessionToken;
    ownerUserId = userId;

    const { sessionToken: otherToken } =
      await createSeedSession(hostConnectionString);
    otherSessionToken = otherToken;

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
    const adminDashboardPage = new AdminDashboardPage({
      baseUrl: adminBaseUrl,
      page: adminBrowser.page,
    });
    await adminDashboardPage.goto();
    const { productId, productName } = await adminDashboardPage.createProduct(
      "E2E Feature Product",
    );

    seededProduct = { id: productId, name: productName };

    if (!ownerUserId) {
      throw new Error("Owner user id must be prepared");
    }

    const db = createDbClient({
      databaseUrl: hostConnectionString,
      nodeEnv: "test",
    });

    const createFeature = async (
      title: string,
      content: string,
      createdAt?: Date,
    ) => {
      const [record] = await db
        .insert(featureRequests)
        .values({
          content,
          createdAt,
          productId,
          title,
          userId: ownerUserId,
        })
        .returning({
          content: featureRequests.content,
          id: featureRequests.id,
          title: featureRequests.title,
        });

      if (!record) {
        throw new Error(`Failed to create feature request: ${title}`);
      }

      return record;
    };

    const orderOldDate = new Date("2024-01-01T00:00:00.000Z");
    const orderNewDate = new Date("2024-01-02T00:00:00.000Z");

    const nonOwner = await createFeature(
      "E2E 未投稿フィーチャー",
      "E2E 未投稿コンテンツ",
    );
    const editable = await createFeature(
      "E2E 編集フィーチャー",
      "E2E 編集前コンテンツ",
    );
    const deletable = await createFeature(
      "E2E 削除フィーチャー",
      "E2E 削除用コンテンツ",
    );
    const reaction = await createFeature(
      "E2E リアクションフィーチャー",
      "E2E リアクション用コンテンツ",
    );
    const orderHigh = await createFeature(
      "E2E 並び順 多い",
      "E2E 並び順コンテンツ",
      orderNewDate,
    );
    const orderSameOld = await createFeature(
      "E2E 並び順 同数 古い",
      "E2E 並び順コンテンツ",
      orderOldDate,
    );
    const orderSameNew = await createFeature(
      "E2E 並び順 同数 新しい",
      "E2E 並び順コンテンツ",
      new Date(orderOldDate.getTime() + 1000 * 60 * 10),
    );
    const closed = await createFeature(
      "E2E クローズ済みフィーチャー",
      "E2E クローズ用コンテンツ",
    );

    seededFeatures = {
      closed,
      deletable,
      editable,
      nonOwner,
      orderHigh,
      orderSameNew,
      orderSameOld,
      reaction,
    };

    await db.insert(featureRequestReactions).values([
      {
        anonymousIdentifier: `reaction-${nonOwner.id}-1`,
        emoji: "👍",
        featureRequestId: orderHigh.id,
      },
      {
        anonymousIdentifier: `reaction-${nonOwner.id}-2`,
        emoji: "👍",
        featureRequestId: orderHigh.id,
      },
      {
        anonymousIdentifier: `reaction-${orderSameOld.id}-1`,
        emoji: "👍",
        featureRequestId: orderSameOld.id,
      },
      {
        anonymousIdentifier: `reaction-${orderSameNew.id}-1`,
        emoji: "👍",
        featureRequestId: orderSameNew.id,
      },
      {
        anonymousIdentifier: `reaction-${reaction.id}-1`,
        emoji: "🔥",
        featureRequestId: reaction.id,
      },
    ]);

    const adminProductPage = new AdminProductPage({
      baseUrl: adminBaseUrl,
      page: adminBrowser.page,
    });
    await adminProductPage.goto(productId);
    await adminProductPage.closeFeatureById(closed.id);

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

Given("admin と user アプリのコンテナを起動している", () => {
  expect(adminStartedContainer).toBeDefined();
  expect(userStartedContainer).toBeDefined();
});

Given("検証用のプロダクトとフィーチャーが用意されている", () => {
  expect(seededProduct).toBeDefined();
  expect(seededFeatures).toBeDefined();
});

Given("認証済みユーザーのセッションが存在する", () => {
  expect(ownerSessionToken).toBeTruthy();
});

Given("別ユーザーの認証済みセッションが存在する", () => {
  expect(otherSessionToken).toBeTruthy();
});

Given("クローズ済みフィーチャーが存在する", () => {
  expect(seededFeatures?.closed).toBeDefined();
});

When("他ユーザーとしてプロダクトページを開いたとき", async () => {
  if (!otherSessionToken || !userUrl || !seededProduct) {
    throw new Error("Other user session and product must be prepared");
  }

  scenarioSession = await createAuthenticatedBrowser(otherSessionToken);
  const productPage = new UserProductPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await productPage.goto(seededProduct.id);
});

Then(
  "他ユーザーが投稿していないフィーチャーに編集ボタンが表示されない",
  async () => {
    if (!scenarioSession || !seededFeatures || !userUrl) {
      throw new Error("Scenario session and features must be available");
    }

    const productPage = new UserProductPage({
      baseUrl: userUrl,
      page: scenarioSession.page,
    });
    await productPage.expectEditButtonHidden(seededFeatures.nonOwner.title);
  },
);

Then("当該フィーチャーの編集ページは404である", async () => {
  if (!scenarioSession || !seededProduct || !seededFeatures || !userUrl) {
    throw new Error("Scenario session and features must be available");
  }

  const requestEditPage = new RequestEditPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await requestEditPage.goto(seededProduct.id, seededFeatures.nonOwner.id);
  await expect(scenarioSession.page.getByText("404 - Not Found")).toBeVisible();
});

let updatedFeatureTitle: string | undefined;
let updatedFeatureContent: string | undefined;

When("自身のフィーチャーの編集ページでタイトルと内容を更新する", async () => {
  if (!ownerSessionToken || !seededProduct || !seededFeatures || !userUrl) {
    throw new Error("Owner session and feature data must be prepared");
  }

  updatedFeatureTitle = "E2E 更新後フィーチャー";
  updatedFeatureContent = "E2E 更新後コンテンツです。";

  scenarioSession = await createAuthenticatedBrowser(ownerSessionToken);
  const requestEditPage = new RequestEditPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await requestEditPage.goto(seededProduct.id, seededFeatures.editable.id);
  await requestEditPage.updateRequest({
    content: updatedFeatureContent,
    title: updatedFeatureTitle,
  });
});

Then("更新したタイトルと内容がプロダクトページに反映される", async () => {
  if (
    !scenarioSession ||
    !seededProduct ||
    !updatedFeatureTitle ||
    !updatedFeatureContent ||
    !userUrl
  ) {
    throw new Error("Scenario session and updated values are required");
  }

  const productPage = new UserProductPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await productPage.goto(seededProduct.id);
  await productPage.waitForFeatureRequestWithReload(
    updatedFeatureTitle,
    60_000,
  );
  await productPage.openFeatureDetail(updatedFeatureTitle);
  await expect(
    scenarioSession.page.getByText(updatedFeatureContent),
  ).toBeVisible();
  await scenarioSession.page.keyboard.press("Escape");
});

Then("自身のフィーチャーには編集ボタンが表示される", async () => {
  if (!scenarioSession || !updatedFeatureTitle || !userUrl) {
    throw new Error("Scenario session and updated title are required");
  }

  const productPage = new UserProductPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await productPage.expectEditButtonVisible(updatedFeatureTitle);
});

When("自身のフィーチャーを削除する", async () => {
  if (!ownerSessionToken || !seededProduct || !seededFeatures || !userUrl) {
    throw new Error("Owner session and feature data must be prepared");
  }

  scenarioSession = await createAuthenticatedBrowser(ownerSessionToken);
  const requestEditPage = new RequestEditPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await requestEditPage.goto(seededProduct.id, seededFeatures.deletable.id);
  await requestEditPage.deleteRequest();
});

Then("削除したフィーチャーが一覧に表示されない", async () => {
  if (!scenarioSession || !seededProduct || !seededFeatures || !userUrl) {
    throw new Error("Scenario session and feature data must be prepared");
  }

  const productPage = new UserProductPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await productPage.goto(seededProduct.id);
  await productPage.waitForFeatureRequestToDisappearWithReload(
    seededFeatures.deletable.title,
    60_000,
  );
});

Then("削除したフィーチャーの編集ページは404である", async () => {
  if (!scenarioSession || !seededProduct || !seededFeatures || !userUrl) {
    throw new Error("Scenario session and feature data must be prepared");
  }

  const requestEditPage = new RequestEditPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await requestEditPage.goto(seededProduct.id, seededFeatures.deletable.id);
  await expect(scenarioSession.page.getByText("404 - Not Found")).toBeVisible();
});

When("検証用プロダクトページを開いたとき", async () => {
  if (!userUrl || !seededProduct) {
    throw new Error("User URL and product must be prepared");
  }

  scenarioSession = await createBrowserSession();
  const productPage = new UserProductPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await productPage.goto(seededProduct.id);
});

Then("フィーチャーが絵文字数と作成日時の順で表示される", async () => {
  if (!scenarioSession || !seededFeatures || !userUrl) {
    throw new Error("Scenario session and feature data must be prepared");
  }

  const productPage = new UserProductPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  const titles = await productPage.getFeatureTitlesInDisplayOrder();
  expect(titles.slice(0, 3)).toEqual([
    seededFeatures.orderHigh.title,
    seededFeatures.orderSameOld.title,
    seededFeatures.orderSameNew.title,
  ]);
});

Then("クローズ済みフィーチャーが一覧の下にあり完了となっている", async () => {
  if (!scenarioSession || !seededFeatures || !userUrl) {
    throw new Error("Scenario session and feature data must be prepared");
  }

  const productPage = new UserProductPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  const titles = await productPage.getFeatureTitlesInDisplayOrder();
  expect(titles.at(-1)).toBe(seededFeatures.closed.title);
});

When("フィーチャーに絵文字リアクションを追加する", async () => {
  if (!userUrl || !seededProduct) {
    throw new Error("User URL and product must be prepared");
  }

  scenarioSession = await createBrowserSession();
  const productPage = new UserProductPage({
    baseUrl: userUrl,
    page: scenarioSession.page,
  });
  await productPage.goto(seededProduct.id);

  const reactionButton = scenarioSession.page.getByRole("button", {
    name: /🔥\s*1/,
  });
  await reactionButton.click();
  await scenarioSession.page.waitForLoadState("networkidle");
});

Then("リアクション数が増える", async () => {
  if (!scenarioSession) {
    throw new Error("Scenario session must be available");
  }

  await expect(
    scenarioSession.page.getByRole("button", { name: /🔥\s*2/ }),
  ).toBeVisible();
});

Then(
  /^Playwright で "([^"]+)" のスクリーンショットを保存できる$/,
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
