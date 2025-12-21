import { accounts, sessions, users, verificationTokens } from "@repo/db";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  DrizzleAdapter: vi.fn(() => ({
    getSessionAndUser: vi.fn(),
  })),
}));

vi.mock("@auth/drizzle-adapter", () => ({
  DrizzleAdapter: mocks.DrizzleAdapter,
}));

const env = process.env as Record<string, string | undefined>;
env.SKIP_ENV_VALIDATION = "true";
env.AUTH_GOOGLE_ID = "test";
env.AUTH_GOOGLE_SECRET = "test";
env.AUTH_SECRET = "test";
env.DATABASE_URL = "https://example.com";
env.NODE_ENV = "test";
env.ADMIN_DOMAIN_URL = "https://example.com";

vi.mock("~/env", () => ({
  env: {
    ADMIN_DOMAIN_URL: "https://example.com",
    AUTH_GOOGLE_ID: "test",
    AUTH_GOOGLE_SECRET: "test",
    AUTH_SECRET: "test",
    DATABASE_URL: "https://example.com",
    NODE_ENV: "test",
  },
}));

vi.mock("~/server/db", () => ({
  db: {},
}));

import { authConfig } from "./config";

describe("authConfig", () => {
  it("uses user tables for NextAuth adapter", () => {
    expect(authConfig.adapter).toBeDefined();
    expect(mocks.DrizzleAdapter).toHaveBeenCalledWith(expect.anything(), {
      accountsTable: accounts,
      sessionsTable: sessions,
      usersTable: users,
      verificationTokensTable: verificationTokens,
    });
  });

  it("uses user-scoped cookie names", () => {
    expect(authConfig.cookies?.sessionToken?.name).toBe(
      "fequest-user-authjs.session-token",
    );
    expect(authConfig.cookies?.csrfToken?.name).toBe(
      "fequest-user-authjs.csrf-token",
    );
  });
});
