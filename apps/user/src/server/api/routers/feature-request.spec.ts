import type { Database } from "@repo/db";
import type { Session } from "next-auth";

import { featureRequestReactions } from "@repo/db";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("~/server/auth", () => ({
  auth: async () => null,
}));

vi.mock("~/server/db", () => ({
  db: {},
}));

const [{ createCallerFactory }, { featureRequestsRouter }] = await Promise.all([
  import("../trpc"),
  import("./feature-request"),
]);

const createCaller = createCallerFactory(featureRequestsRouter);

type HarnessOptions = {
  featureRequest?: null | { id: number };
  reactionCounts?: Array<{ count: number; emoji: string }>;
  session?: null | Pick<Session, "expires" | "user">;
};

const createTestHarness = (options: HarnessOptions = {}) => {
  const featureRequest = Object.hasOwn(options, "featureRequest")
    ? options.featureRequest
    : { id: 1 };

  const findFirst = vi.fn().mockResolvedValue(featureRequest);

  const insertOnConflict = vi.fn();
  const insertValues = vi.fn(() => ({
    onConflictDoNothing: insertOnConflict,
  }));
  const insertMock = vi.fn(() => ({
    values: insertValues,
  }));

  const deleteWhere = vi.fn();
  const deleteMock = vi.fn(() => ({
    where: deleteWhere,
  }));

  const groupBy = vi.fn().mockResolvedValue(options.reactionCounts ?? []);
  const selectWhere = vi.fn(() => ({
    groupBy,
  }));
  const selectFrom = vi.fn(() => ({
    where: selectWhere,
  }));
  const selectMock = vi.fn(() => ({
    from: selectFrom,
  }));

  const db = {
    delete: deleteMock,
    insert: insertMock,
    query: {
      featureRequests: {
        findFirst,
      },
    },
    select: selectMock,
  } as unknown as Database;

  const caller = createCaller({
    db,
    headers: new Headers(),
    session: (options.session ?? null) as null | Session,
  });

  return {
    caller,
    deleteMock,
    deleteWhere,
    findFirst,
    groupBy,
    insertMock,
    insertOnConflict,
    insertValues,
    selectFrom,
    selectMock,
    selectWhere,
  };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("featureRequestsRouter.react", () => {
  it("adds a reaction for an authenticated user", async () => {
    const reactionCounts = [{ count: 3, emoji: "🔥" }];
    const harness = createTestHarness({
      featureRequest: { id: 55 },
      reactionCounts,
      session: { expires: new Date().toISOString(), user: { id: "user-123" } },
    });

    const result = await harness.caller.react({
      action: "up",
      emoji: "🔥",
      id: 55,
    });

    expect(harness.insertMock).toHaveBeenCalledWith(featureRequestReactions);
    expect(harness.insertValues).toHaveBeenCalledWith({
      anonymousIdentifier: null,
      emoji: "🔥",
      featureRequestId: 55,
      userId: "user-123",
    });

    expect(harness.findFirst).toHaveBeenCalledWith({
      columns: { id: true },
      where: expect.any(Function),
    });

    expect(harness.selectMock).toHaveBeenCalledWith({
      count: expect.anything(),
      emoji: featureRequestReactions.emoji,
    });
    expect(harness.selectFrom).toHaveBeenCalledWith(featureRequestReactions);
    expect(harness.groupBy).toHaveBeenCalledWith(featureRequestReactions.emoji);

    expect(result).toEqual({
      action: "up",
      counts: reactionCounts,
      featureRequestId: 55,
    });
  });

  it("removes a reaction for an anonymous user when action is down", async () => {
    const harness = createTestHarness({
      featureRequest: { id: 77 },
    });

    const result = await harness.caller.react({
      action: "down",
      anonymousIdentifier: "anon-123",
      emoji: "👍",
      id: 77,
    });

    expect(harness.deleteMock).toHaveBeenCalledWith(featureRequestReactions);
    expect(harness.deleteWhere).toHaveBeenCalledTimes(1);
    expect(harness.insertValues).not.toHaveBeenCalled();

    expect(result).toEqual({
      action: "down",
      counts: [],
      featureRequestId: 77,
    });
  });

  it("throws when no identity is available for a reaction", async () => {
    const harness = createTestHarness({
      featureRequest: { id: 88 },
    });

    await expect(
      harness.caller.react({
        action: "up",
        emoji: "🎉",
        id: 88,
      }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "anonymousIdentifier is required for anonymous reactions",
    });
  });

  it("throws when the supplied feature request does not exist", async () => {
    const harness = createTestHarness({
      featureRequest: null,
      session: { expires: new Date().toISOString(), user: { id: "user-1" } },
    });

    await expect(
      harness.caller.react({
        action: "up",
        emoji: "🔥",
        id: 999,
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("requires action to be up or down", async () => {
    const harness = createTestHarness({
      featureRequest: { id: 12 },
      session: { expires: new Date().toISOString(), user: { id: "user-123" } },
    });

    await expect(
      harness.caller.react({
        action: "sideways",
        emoji: "🔥",
        id: 12,
      }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "action must be either 'up' or 'down'",
    });
  });
});
