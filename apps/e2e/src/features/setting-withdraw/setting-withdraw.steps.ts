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
import { SettingPage as AdminSettingPage } from "@repo/admin-feature-setting/e2e";
import {
  adminSessions,
  adminUsers,
  createDbClient,
  featureRequestReactions,
  featureRequests,
  products,
  resetCachedConnection,
  users,
} from "@repo/db";
import { migrateDatabase } from "@repo/db/migrate";
import { SettingPage as UserSettingPage } from "@repo/user-feature-setting/e2e";
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

const adminScreenshotPath = resolve(__dirname, "setting-withdraw-admin.png");
const userScreenshotPath = resolve(__dirname, "setting-withdraw-user.png");

type AdminWithdrawSeed = {
  adminSessionToken: string;
  adminUserId: string;
  featureRequestId: number;
  productId: number;
  reactionId: number;
};

type UserWithdrawSeed = {
  featureRequestId: number;
  productId: number;
  reactionId: number;
  sessionToken: string;
  userId: string;
};

let userStartedContainer: StartedTestContainer | undefined;
let adminStartedContainer: StartedTestContainer | undefined;
let dbStartedContainer: StartedTestContainer | undefined;
let network: StartedNetwork | undefined;
let userUrl: string | undefined;
let adminUrl: string | undefined;
let databaseUrlForHost: string | undefined;

let adminWithdrawSeed: AdminWithdrawSeed | undefined;
let userWithdrawSeed: undefined | UserWithdrawSeed;

let scenarioSession: BrowserSession | undefined;
let cleanupStarted = false;

const createAdminWithdrawSeed = async (databaseUrl: string) => {
  const db = createDbClient({ databaseUrl, nodeEnv: "test" });
  const adminUserId = `e2e-admin-${randomUUID()}`;
  const adminSessionToken = `e2e-admin-session-${randomUUID()}`;

  await db.insert(adminUsers).values({
    email: `${adminUserId}@example.com`,
    id: adminUserId,
    name: "E2E Admin",
  });

  await db.insert(adminSessions).values({
    expires: new Date(Date.now() + 1000 * 60 * 60),
    sessionToken: adminSessionToken,
    userId: adminUserId,
  });

  const [product] = await db
    .insert(products)
    .values({
      name: "E2E Admin Withdraw Product",
      userId: adminUserId,
    })
    .returning({ id: products.id });
  if (!product) {
    throw new Error("Failed to create admin withdraw product");
  }

  const featureUserId = `e2e-user-${randomUUID()}`;
  await db.insert(users).values({
    email: `${featureUserId}@example.com`,
    id: featureUserId,
    name: "E2E User",
  });

  const [featureRequest] = await db
    .insert(featureRequests)
    .values({
      content: "E2E Admin Withdraw Content",
      productId: product.id,
      title: "E2E Admin Withdraw Feature",
      userId: featureUserId,
    })
    .returning({ id: featureRequests.id });
  if (!featureRequest) {
    throw new Error("Failed to create admin withdraw feature request");
  }

  const [reaction] = await db
    .insert(featureRequestReactions)
    .values({
      emoji: "👍",
      featureRequestId: featureRequest.id,
      userId: featureUserId,
    })
    .returning({ id: featureRequestReactions.id });
  if (!reaction) {
    throw new Error("Failed to create admin withdraw reaction");
  }

  return {
    adminSessionToken,
    adminUserId,
    featureRequestId: featureRequest.id,
    productId: product.id,
    reactionId: reaction.id,
  };
};

const createUserWithdrawSeed = async (databaseUrl: string) => {
  const db = createDbClient({ databaseUrl, nodeEnv: "test" });
  const adminUserId = `e2e-admin-${randomUUID()}`;

  await db.insert(adminUsers).values({
    email: `${adminUserId}@example.com`,
    id: adminUserId,
    name: "E2E Admin",
  });

  const [product] = await db
    .insert(products)
    .values({
      name: "E2E User Withdraw Product",
      userId: adminUserId,
    })
    .returning({ id: products.id });
  if (!product) {
    throw new Error("Failed to create user withdraw product");
  }

  const { sessionToken, userId } = await createSeedSession(databaseUrl);

  const [featureRequest] = await db
    .insert(featureRequests)
    .values({
      content: "E2E User Withdraw Content",
      productId: product.id,
      title: "E2E User Withdraw Feature",
      userId,
    })
    .returning({ id: featureRequests.id });
  if (!featureRequest) {
    throw new Error("Failed to create user withdraw feature request");
  }

  const [reaction] = await db
    .insert(featureRequestReactions)
    .values({
      emoji: "🎉",
      featureRequestId: featureRequest.id,
      userId,
    })
    .returning({ id: featureRequestReactions.id });
  if (!reaction) {
    throw new Error("Failed to create user withdraw reaction");
  }

  return {
    featureRequestId: featureRequest.id,
    productId: product.id,
    reactionId: reaction.id,
    sessionToken,
    userId,
  };
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

const createUserBrowser = async (sessionToken: string) => {
  if (!userUrl) {
    throw new Error("User URL must be prepared before creating sessions");
  }

  const session = await createBrowserSession();
  const domain = new URL(userUrl).hostname;
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
      name: "fequest-user-authjs.session-token",
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
    databaseUrlForHost = hostConnectionString;

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

    adminWithdrawSeed = await createAdminWithdrawSeed(hostConnectionString);
    userWithdrawSeed = await createUserWithdrawSeed(hostConnectionString);
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

Given("管理者とユーザーのアプリのコンテナを起動している", () => {
  expect(adminStartedContainer).toBeDefined();
  expect(userStartedContainer).toBeDefined();
});

Given("管理者の検証用プロダクトとフィーチャーが用意されている", () => {
  expect(adminWithdrawSeed).toBeDefined();
});

Given("管理者の認証済みセッションが存在する", () => {
  expect(adminWithdrawSeed?.adminSessionToken).toBeTruthy();
});

When("管理画面の設定ページで退会する", async () => {
  if (!adminWithdrawSeed || !adminUrl) {
    throw new Error("Admin seed data and admin URL must be prepared");
  }

  scenarioSession = await createAdminBrowser(
    adminWithdrawSeed.adminSessionToken,
  );
  const settingPage = new AdminSettingPage({
    baseUrl: `${adminUrl}/setting`,
    page: scenarioSession.page,
  });
  await settingPage.goto();
  await settingPage.confirmWithdraw();
  await scenarioSession.page.waitForURL("**/sign-in**", {
    waitUntil: "networkidle",
  });
});

Then("管理者のプロダクトとフィーチャーがデータベースに存在しない", async () => {
  if (!adminWithdrawSeed || !databaseUrlForHost) {
    throw new Error("Admin seed data and database URL must be prepared");
  }

  const seed = adminWithdrawSeed;
  const db = createDbClient({
    databaseUrl: databaseUrlForHost,
    nodeEnv: "test",
  });
  const remainingProducts = await db.query.products.findMany({
    columns: { id: true },
    where: (product, { eq }) => eq(product.userId, seed.adminUserId),
  });
  const remainingFeatures = await db.query.featureRequests.findMany({
    columns: { id: true },
    where: (featureRequest, { eq }) =>
      eq(featureRequest.productId, seed.productId),
  });
  const remainingReactions = await db.query.featureRequestReactions.findMany({
    columns: { id: true },
    where: (reaction, { eq }) =>
      eq(reaction.featureRequestId, seed.featureRequestId),
  });

  expect(remainingProducts).toHaveLength(0);
  expect(remainingFeatures).toHaveLength(0);
  expect(remainingReactions).toHaveLength(0);
});

Then("管理者のユーザー情報がデータベースに存在しない", async () => {
  if (!adminWithdrawSeed || !databaseUrlForHost) {
    throw new Error("Admin seed data and database URL must be prepared");
  }

  const seed = adminWithdrawSeed;
  const db = createDbClient({
    databaseUrl: databaseUrlForHost,
    nodeEnv: "test",
  });
  const adminUser = await db.query.adminUsers.findFirst({
    where: (adminUser, { eq }) => eq(adminUser.id, seed.adminUserId),
  });
  const adminSession = await db.query.adminSessions.findFirst({
    where: (session, { eq }) => eq(session.userId, seed.adminUserId),
  });

  expect(adminUser).toBeUndefined();
  expect(adminSession).toBeUndefined();
});

Then(
  /^Playwright で設定画面の "([^"]+)" のスクリーンショットを保存できる$/,
  async (fileName: string) => {
    if (!scenarioSession) {
      throw new Error("Scenario session must be prepared");
    }

    const targetPath =
      fileName === "setting-withdraw-admin.png"
        ? adminScreenshotPath
        : resolve(__dirname, fileName);
    await mkdir(dirname(targetPath), { recursive: true });
    await scenarioSession.page.screenshot({ fullPage: true, path: targetPath });
    const fileStats = await stat(targetPath);
    expect(fileStats.size).toBeGreaterThan(0);
  },
);

Given("ユーザーの検証用フィーチャーとリアクションが用意されている", () => {
  expect(userWithdrawSeed).toBeDefined();
});

Given("ユーザーの認証済みセッションが存在する", () => {
  expect(userWithdrawSeed?.sessionToken).toBeTruthy();
});

When("ユーザー設定ページで退会する", async () => {
  if (!userWithdrawSeed || !userUrl) {
    throw new Error("User seed data and user URL must be prepared");
  }

  scenarioSession = await createUserBrowser(userWithdrawSeed.sessionToken);
  const settingPage = new UserSettingPage({
    baseUrl: `${userUrl}/setting`,
    page: scenarioSession.page,
  });
  await settingPage.goto();
  await settingPage.confirmWithdraw();
  await scenarioSession.page.waitForURL((url) => url.pathname === "/", {
    waitUntil: "networkidle",
  });
});

Then(
  "ユーザーのフィーチャーとリアクションがデータベースに存在しない",
  async () => {
    if (!userWithdrawSeed || !databaseUrlForHost) {
      throw new Error("User seed data and database URL must be prepared");
    }

    const seed = userWithdrawSeed;
    const db = createDbClient({
      databaseUrl: databaseUrlForHost,
      nodeEnv: "test",
    });
    const remainingFeatures = await db.query.featureRequests.findMany({
      columns: { id: true },
      where: (featureRequest, { eq }) => eq(featureRequest.userId, seed.userId),
    });
    const remainingReactions = await db.query.featureRequestReactions.findMany({
      columns: { id: true },
      where: (reaction, { eq }) => eq(reaction.userId, seed.userId),
    });

    expect(remainingFeatures).toHaveLength(0);
    expect(remainingReactions).toHaveLength(0);
  },
);

Then("ユーザーのユーザー情報がデータベースに存在しない", async () => {
  if (!userWithdrawSeed || !databaseUrlForHost) {
    throw new Error("User seed data and database URL must be prepared");
  }

  const seed = userWithdrawSeed;
  const db = createDbClient({
    databaseUrl: databaseUrlForHost,
    nodeEnv: "test",
  });
  const user = await db.query.users.findFirst({
    where: (record, { eq }) => eq(record.id, seed.userId),
  });
  const userSession = await db.query.sessions.findFirst({
    where: (record, { eq }) => eq(record.userId, seed.userId),
  });

  expect(user).toBeUndefined();
  expect(userSession).toBeUndefined();
});

Then(
  /^Playwright でユーザー画面の "([^"]+)" のスクリーンショットを保存できる$/,
  async (fileName: string) => {
    if (!scenarioSession) {
      throw new Error("Scenario session must be prepared");
    }

    const targetPath =
      fileName === "setting-withdraw-user.png"
        ? userScreenshotPath
        : resolve(__dirname, fileName);
    await mkdir(dirname(targetPath), { recursive: true });
    await scenarioSession.page.screenshot({ fullPage: true, path: targetPath });
    const fileStats = await stat(targetPath);
    expect(fileStats.size).toBeGreaterThan(0);
  },
);
