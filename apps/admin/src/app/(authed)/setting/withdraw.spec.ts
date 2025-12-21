import {
  adminAccounts,
  adminSessions,
  adminUsers,
  featureRequests,
  products,
} from "@repo/db";
import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  redirect: vi.fn(),
  signOut: vi.fn(),
  transaction: vi.fn(),
}));

vi.mock("~/server/auth", () => ({
  auth: mocks.auth,
  signOut: mocks.signOut,
}));

vi.mock("~/server/db", () => ({
  db: {
    transaction: mocks.transaction,
  },
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createWithdraw } from "./withdraw";

afterEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReset();
  mocks.redirect.mockReset();
  mocks.signOut.mockReset();
  mocks.transaction.mockReset();
});

describe("createWithdraw", () => {
  it("redirects when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValueOnce(null);
    const action = createWithdraw();

    await action();

    expect(mocks.redirect).toHaveBeenCalledWith("/sign-in");
    expect(mocks.transaction).not.toHaveBeenCalled();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it("deletes user data and signs out", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "admin-1" } });

    const deleteWhere = vi.fn();
    const txDelete = vi.fn(() => ({
      where: deleteWhere,
    }));
    const findMany = vi.fn().mockResolvedValue([{ id: 4 }]);

    mocks.transaction.mockImplementation(async (callback) => {
      await callback({
        delete: txDelete,
        query: {
          products: {
            findMany,
          },
        },
      });
    });

    const action = createWithdraw();

    await action();

    expect(findMany).toHaveBeenCalled();
    expect(txDelete).toHaveBeenCalledWith(featureRequests);
    expect(txDelete).toHaveBeenCalledWith(products);
    expect(txDelete).toHaveBeenCalledWith(adminAccounts);
    expect(txDelete).toHaveBeenCalledWith(adminSessions);
    expect(txDelete).toHaveBeenCalledWith(adminUsers);
    expect(mocks.signOut).toHaveBeenCalledWith({ redirectTo: "/sign-in" });
  });
});
