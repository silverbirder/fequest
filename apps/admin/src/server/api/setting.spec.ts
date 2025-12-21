import type { Database } from "@repo/db";
import type { Session } from "next-auth";

import {
  adminAccounts,
  adminSessions,
  adminUsers,
  featureRequests,
  products,
} from "@repo/db";
import { TRPCError } from "@trpc/server";
import { afterEach, describe, expect, it, vi } from "vitest";

let mockSession: null | Session = null;

vi.mock("~/server/auth", () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
}));

vi.mock("~/server/db", () => ({
  db: {},
}));

const [{ createCallerFactory }, { settingRouter }] = await Promise.all([
  import("./trpc"),
  import("./setting"),
]);

const createCaller = createCallerFactory(settingRouter);

type HarnessOptions = {
  ownedProducts?: Array<{ id: number }>;
  session?: null | Session;
};

const createTestHarness = (options: HarnessOptions = {}) => {
  const updateWhere = vi.fn();
  const updateSet = vi.fn(() => ({
    where: updateWhere,
  }));
  const update = vi.fn((table) => {
    if (table === adminUsers) {
      return { set: updateSet };
    }
    throw new Error("Unexpected table");
  });

  const deleteWhere = vi.fn();
  const txDelete = vi.fn(() => ({
    where: deleteWhere,
  }));
  const findMany = vi.fn().mockResolvedValue(options.ownedProducts ?? []);

  const transaction = vi.fn(async (callback) => {
    await callback({
      delete: txDelete,
      query: {
        products: {
          findMany,
        },
      },
    });
  });

  const db = {
    transaction,
    update,
  } as unknown as Database;

  mockSession = options.session ?? null;

  const headers = new Headers();
  const caller = createCaller({ db, headers, session: mockSession });

  return {
    caller,
    deleteWhere,
    findMany,
    transaction,
    txDelete,
    update,
    updateSet,
    updateWhere,
  };
};

afterEach(() => {
  vi.clearAllMocks();
});

describe("settingRouter.updateAvatar", () => {
  it("updates the avatar for the signed-in admin", async () => {
    const { caller, update, updateSet, updateWhere } = createTestHarness({
      session: {
        expires: "",
        user: { id: "admin-1", name: "Admin" },
      },
    });

    await expect(
      caller.updateAvatar("  https://example.com/avatar.png  "),
    ).resolves.toEqual({ image: "https://example.com/avatar.png" });

    expect(update).toHaveBeenCalledWith(adminUsers);
    expect(updateSet).toHaveBeenCalledWith({
      image: "https://example.com/avatar.png",
    });
    expect(updateWhere).toHaveBeenCalled();
  });

  it("throws UNAUTHORIZED without a session", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(
      caller.updateAvatar("https://example.com/avatar.png"),
    ).rejects.toBeInstanceOf(TRPCError);
    await expect(
      caller.updateAvatar("https://example.com/avatar.png"),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

describe("settingRouter.withdraw", () => {
  it("deletes admin data in a transaction", async () => {
    const { caller, findMany, transaction, txDelete } = createTestHarness({
      ownedProducts: [{ id: 1 }],
      session: {
        expires: "",
        user: { id: "admin-1", name: "Admin" },
      },
    });

    await expect(caller.withdraw()).resolves.toEqual({ id: "admin-1" });

    expect(transaction).toHaveBeenCalled();
    expect(findMany).toHaveBeenCalled();
    expect(txDelete).toHaveBeenCalledWith(featureRequests);
    expect(txDelete).toHaveBeenCalledWith(products);
    expect(txDelete).toHaveBeenCalledWith(adminAccounts);
    expect(txDelete).toHaveBeenCalledWith(adminSessions);
    expect(txDelete).toHaveBeenCalledWith(adminUsers);
  });
});
