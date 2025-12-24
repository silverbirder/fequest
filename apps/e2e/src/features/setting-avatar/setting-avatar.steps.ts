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
  resetCachedConnection,
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

const adminScreenshotPath = resolve(__dirname, "setting-avatar-admin.png");
const userScreenshotPath = resolve(__dirname, "setting-avatar-user.png");

const adminAvatarUrl = "https://placehold.co/400x400";
const userAvatarUrl = "https://placehold.co/400x400";

type AdminAvatarSeed = {
  adminSessionToken: string;
  adminUserId: string;
};

type UserAvatarSeed = {
  sessionToken: string;
  userId: string;
};

let userStartedContainer: StartedTestContainer | undefined;
let adminStartedContainer: StartedTestContainer | undefined;
let dbStartedContainer: StartedTestContainer | undefined;
let network: StartedNetwork | undefined;
let userUrl: string | undefined;
let adminUrl: string | undefined;

let adminAvatarSeed: AdminAvatarSeed | undefined;
let userAvatarSeed: undefined | UserAvatarSeed;

let scenarioSession: BrowserSession | undefined;
let cleanupStarted = false;

const createAdminSeedSession = async (databaseUrl: string) => {
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

  return {
    adminSessionToken,
    adminUserId,
  };
};

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

const cleanup = async () => {
  if (cleanupStarted) {
    return;
  }
  cleanupStarted = true;

  if (scenarioSession) {
    await scenarioSession.close();
    scenarioSession = undefined;
  }

  if (adminStartedContainer) {
    await stopAdmin(adminStartedContainer);
    adminStartedContainer = undefined;
    adminUrl = undefined;
  }

  if (userStartedContainer) {
    await stopUser(userStartedContainer);
    userStartedContainer = undefined;
    userUrl = undefined;
  }

  if (dbStartedContainer) {
    await stopDatabase(dbStartedContainer);
    dbStartedContainer = undefined;
  }

  if (network) {
    await network.stop();
    network = undefined;
  }
};

const registerCleanupHandlers = () => {
  if (process.listenerCount("SIGINT") > 0) {
    return;
  }

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

    const startedAdmin = await startAdmin(startedNetwork, connectionString, {
      hostPort: adminHostPort,
    });
    adminStartedContainer = startedAdmin.container;
    adminUrl = startedAdmin.url;

    const startedUser = await startUser(startedNetwork, connectionString, {
      hostPort: userHostPort,
    });
    userStartedContainer = startedUser.container;
    userUrl = startedUser.url;

    adminAvatarSeed = await createAdminSeedSession(hostConnectionString);
    userAvatarSeed = await createSeedSession(hostConnectionString);
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

Given(
  "アバター画像用に管理者とユーザーのアプリのコンテナを起動している",
  () => {
    expect(adminStartedContainer).toBeDefined();
    expect(userStartedContainer).toBeDefined();
  },
);

Given("アバター画像用に管理者の認証済みセッションが存在する", () => {
  expect(adminAvatarSeed?.adminSessionToken).toBeTruthy();
});

When("管理画面の設定ページでアバター画像を更新する", async () => {
  if (!adminAvatarSeed || !adminUrl) {
    throw new Error("Admin seed data and admin URL must be prepared");
  }

  scenarioSession = await createAdminBrowser(adminAvatarSeed.adminSessionToken);
  const settingPage = new AdminSettingPage({
    baseUrl: `${adminUrl}/setting`,
    page: scenarioSession.page,
  });
  await settingPage.goto();
  await settingPage.updateAvatar(adminAvatarUrl);
  await scenarioSession.page.waitForLoadState("networkidle");
});

Then("管理画面のアバター画像が更新されている", async () => {
  if (!scenarioSession) {
    throw new Error("Scenario session must be prepared");
  }

  const settingPage = new AdminSettingPage({
    baseUrl: `${adminUrl}/setting`,
    page: scenarioSession.page,
  });
  await expect(settingPage.avatarUrlInput).toHaveValue(adminAvatarUrl);
});

Then(
  /^Playwright でアバター画像更新後の管理画面 "([^"]+)" のスクリーンショットを保存できる$/,
  async (fileName: string) => {
    if (!scenarioSession) {
      throw new Error("Scenario session must be prepared");
    }

    const targetPath =
      fileName === "setting-avatar-admin.png"
        ? adminScreenshotPath
        : resolve(__dirname, fileName);
    await mkdir(dirname(targetPath), { recursive: true });
    await scenarioSession.page.screenshot({ fullPage: true, path: targetPath });
    const fileStats = await stat(targetPath);
    expect(fileStats.size).toBeGreaterThan(0);
  },
);

Given("アバター画像用にユーザーの認証済みセッションが存在する", () => {
  expect(userAvatarSeed?.sessionToken).toBeTruthy();
});

When("ユーザー設定ページでアバター画像を更新する", async () => {
  if (!userAvatarSeed || !userUrl) {
    throw new Error("User seed data and user URL must be prepared");
  }

  scenarioSession = await createUserBrowser(userAvatarSeed.sessionToken);
  const settingPage = new UserSettingPage({
    baseUrl: `${userUrl}/setting`,
    page: scenarioSession.page,
  });
  await settingPage.goto();
  await settingPage.updateAvatar(userAvatarUrl);
  await scenarioSession.page.waitForLoadState("networkidle");
});

Then("ユーザー画面のアバター画像が更新されている", async () => {
  if (!scenarioSession) {
    throw new Error("Scenario session must be prepared");
  }

  const settingPage = new UserSettingPage({
    baseUrl: `${userUrl}/setting`,
    page: scenarioSession.page,
  });
  await expect(settingPage.avatarUrlInput).toHaveValue(userAvatarUrl);
});

Then(
  /^Playwright でアバター画像更新後のユーザー画面 "([^"]+)" のスクリーンショットを保存できる$/,
  async (fileName: string) => {
    if (!scenarioSession) {
      throw new Error("Scenario session must be prepared");
    }

    const targetPath =
      fileName === "setting-avatar-user.png"
        ? userScreenshotPath
        : resolve(__dirname, fileName);
    await mkdir(dirname(targetPath), { recursive: true });
    await scenarioSession.page.screenshot({ fullPage: true, path: targetPath });
    const fileStats = await stat(targetPath);
    expect(fileStats.size).toBeGreaterThan(0);
  },
);
