import {
  adminAccounts,
  adminSessions,
  adminUsers,
  adminVerificationTokens,
} from "@repo/db";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  DrizzleAdapter: vi.fn(() => ({
    getSessionAndUser: vi.fn(),
  })),
}));

vi.mock("@auth/drizzle-adapter", () => ({
  DrizzleAdapter: mocks.DrizzleAdapter,
}));

vi.mock("~/server/db", () => ({
  db: {},
}));

import { authConfig } from "./config";

describe("authConfig", () => {
  it("uses admin tables for NextAuth adapter", () => {
    expect(authConfig.adapter).toBeDefined();
    expect(mocks.DrizzleAdapter).toHaveBeenCalledWith(expect.anything(), {
      accountsTable: adminAccounts,
      sessionsTable: adminSessions,
      usersTable: adminUsers,
      verificationTokensTable: adminVerificationTokens,
    });
  });
});
