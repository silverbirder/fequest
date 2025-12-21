import type { Database } from "@repo/db";
import type { Session } from "next-auth";

import {
  accounts,
  featureRequestReactions,
  featureRequests,
  sessions,
  users,
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
  import("../trpc"),
  import("./setting"),
]);

const createCaller = createCallerFactory(settingRouter);

type HarnessOptions = {
  session?: null | Session;
};

const createTestHarness = (options: HarnessOptions = {}) => {
  const updateWhere = vi.fn();
  const updateSet = vi.fn(() => ({
    where: updateWhere,
  }));
  const update = vi.fn((table) => {
    if (table === users) {
      return { set: updateSet };
    }
    throw new Error("Unexpected table");
  });

  const deleteWhere = vi.fn();
  const txDelete = vi.fn(() => ({
    where: deleteWhere,
  }));

  const transaction = vi.fn(async (callback) => {
    await callback({
      delete: txDelete,
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
  it("updates the avatar for the signed-in user", async () => {
    const { caller, update, updateSet, updateWhere } = createTestHarness({
      session: {
        expires: "",
        user: { id: "user-1", name: "User" },
      },
    });

    await expect(
      caller.updateAvatar("  https://example.com/avatar.png  "),
    ).resolves.toEqual({ image: "https://example.com/avatar.png" });

    expect(update).toHaveBeenCalledWith(users);
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
  it("deletes user data in a transaction", async () => {
    const { caller, transaction, txDelete } = createTestHarness({
      session: {
        expires: "",
        user: { id: "user-1", name: "User" },
      },
    });

    await expect(caller.withdraw()).resolves.toEqual({ id: "user-1" });

    expect(transaction).toHaveBeenCalled();
    expect(txDelete).toHaveBeenCalledWith(featureRequestReactions);
    expect(txDelete).toHaveBeenCalledWith(featureRequests);
    expect(txDelete).toHaveBeenCalledWith(accounts);
    expect(txDelete).toHaveBeenCalledWith(sessions);
    expect(txDelete).toHaveBeenCalledWith(users);
  });
});
