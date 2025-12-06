import type { Database } from "@repo/db";
import type { Session } from "next-auth";

import { featureRequestReactions, featureRequests } from "@repo/db";
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

type ReactHarnessOptions = {
  featureRequest?: null | { id: number };
  reactionCounts?: Array<{ count: number; emoji: string }>;
  session?: null | Pick<Session, "expires" | "user">;
};

const createReactHarness = (options: ReactHarnessOptions = {}) => {
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

type CreateHarnessOptions = {
  insertedFeatureRequest?: {
    content: string;
    id: number;
    status: string;
    title: string;
  };
  product?: null | { id: number };
  session?: null | Pick<Session, "expires" | "user">;
};

const createCreateHarness = (options: CreateHarnessOptions = {}) => {
  const product = Object.hasOwn(options, "product")
    ? options.product
    : { id: 1 };

  const insertResult = options.insertedFeatureRequest ?? {
    content: "",
    id: 123,
    status: "open",
    title: "Add export feature",
  };

  const findProduct = vi.fn().mockResolvedValue(product);

  const returning = vi.fn().mockResolvedValue([insertResult]);
  const values = vi.fn(() => ({
    returning,
  }));
  const insertMock = vi.fn(() => ({
    values,
  }));

  const db = {
    insert: insertMock,
    query: {
      products: {
        findFirst: findProduct,
      },
    },
  } as unknown as Database;

  const resolvedSession = Object.hasOwn(options, "session")
    ? ((options.session ?? null) as null | Session)
    : ({
        expires: new Date().toISOString(),
        user: { id: "user-abc" },
      } as Session);

  const caller = createCaller({
    db,
    headers: new Headers(),
    session: resolvedSession,
  });

  return {
    caller,
    findProduct,
    insertMock,
    returning,
    session: resolvedSession,
    values,
  };
};

type DeleteHarnessOptions = {
  featureRequest?: null | { id: number; userId: null | string };
  session?: null | Pick<Session, "expires" | "user">;
};

const createDeleteHarness = (options: DeleteHarnessOptions = {}) => {
  const featureRequest = Object.hasOwn(options, "featureRequest")
    ? options.featureRequest
    : { id: 5, userId: "owner-user" };

  const findFirst = vi.fn().mockResolvedValue(featureRequest);
  const deleteWhere = vi.fn();
  const deleteMock = vi.fn(() => ({
    where: deleteWhere,
  }));

  const db = {
    delete: deleteMock,
    query: {
      featureRequests: {
        findFirst,
      },
    },
  } as unknown as Database;

  const resolvedSession = Object.hasOwn(options, "session")
    ? (options.session ?? null)
    : ({
        expires: new Date().toISOString(),
        user: { id: featureRequest?.userId ?? "owner-user" },
      } as Session);

  const caller = createCaller({
    db,
    headers: new Headers(),
    session: resolvedSession,
  });

  return {
    caller,
    deleteMock,
    deleteWhere,
    findFirst,
  };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("featureRequestsRouter.react", () => {
  it("adds a reaction for an authenticated user", async () => {
    const reactionCounts = [{ count: 3, emoji: "🔥" }];
    const harness = createReactHarness({
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
    const harness = createReactHarness({
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
    const harness = createReactHarness({
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
    const harness = createReactHarness({
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
    const harness = createReactHarness({
      featureRequest: { id: 12 },
      session: { expires: new Date().toISOString(), user: { id: "user-123" } },
    });

    await expect(
      harness.caller.react({
        action: "sideways" as unknown as "up",
        emoji: "🔥",
        id: 12,
      }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });
});

describe("featureRequestsRouter.create", () => {
  it("creates a feature request for the authenticated user", async () => {
    const harness = createCreateHarness({
      insertedFeatureRequest: {
        content: "",
        id: 44,
        status: "open",
        title: "Add integrations",
      },
    });

    const result = await harness.caller.create({
      productId: 1,
      title: "  Add integrations  ",
    });

    expect(harness.findProduct).toHaveBeenCalledWith({
      columns: { id: true },
      where: expect.any(Function),
    });
    expect(harness.insertMock).toHaveBeenCalledWith(featureRequests);
    expect(harness.values).toHaveBeenCalledWith({
      content: "",
      productId: 1,
      title: "Add integrations",
      userId: harness.session?.user?.id,
    });
    expect(harness.returning).toHaveBeenCalledWith({
      content: featureRequests.content,
      id: featureRequests.id,
      status: featureRequests.status,
      title: featureRequests.title,
    });
    expect(result).toEqual({
      content: "",
      id: 44,
      status: "open",
      title: "Add integrations",
    });
  });

  it("throws when no user is authenticated", async () => {
    const harness = createCreateHarness({ session: null });

    await expect(
      harness.caller.create({
        productId: 3,
        title: "Dark mode",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("throws when the product does not exist", async () => {
    const harness = createCreateHarness({ product: null });

    await expect(
      harness.caller.create({
        productId: 999,
        title: "Offline support",
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects empty content after trimming", async () => {
    const harness = createCreateHarness();

    await expect(
      harness.caller.create({
        productId: 2,
        title: "   \t",
      }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

describe("featureRequestsRouter.delete", () => {
  it("removes the feature request when the creator deletes it", async () => {
    const harness = createDeleteHarness();

    const result = await harness.caller.delete({ id: 5 });

    expect(harness.findFirst).toHaveBeenCalledWith({
      columns: { id: true, userId: true },
      where: expect.any(Function),
    });
    expect(harness.deleteMock).toHaveBeenCalledWith(featureRequests);
    expect(harness.deleteWhere).toHaveBeenCalled();
    expect(result).toEqual({ id: 5 });
  });

  it("throws FORBIDDEN when a different user attempts to delete", async () => {
    const harness = createDeleteHarness({
      session: {
        expires: new Date().toISOString(),
        user: { id: "other-user" },
      },
    });

    await expect(harness.caller.delete({ id: 5 })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });

    expect(harness.deleteMock).not.toHaveBeenCalled();
  });

  it("throws NOT_FOUND when the feature request is missing", async () => {
    const harness = createDeleteHarness({
      featureRequest: null,
      session: {
        expires: new Date().toISOString(),
        user: { id: "owner-user" },
      },
    });

    await expect(harness.caller.delete({ id: 99 })).rejects.toMatchObject({
      code: "NOT_FOUND",
    });

    expect(harness.deleteMock).not.toHaveBeenCalled();
  });
});

describe("featureRequestsRouter.update", () => {
  const createUpdateHarness = (
    options: {
      featureRequest?: null | {
        id: number;
        productId?: number;
        userId?: null | string;
      };
      sessionUserId?: null | string;
      updated?: { content: string; id: number; updatedAt?: string };
    } = {},
  ) => {
    const featureRequest = Object.hasOwn(options, "featureRequest")
      ? options.featureRequest
      : { id: 9, productId: 2, userId: "owner-user" };

    const findFirst = vi.fn().mockResolvedValue(featureRequest);

    const defaultUpdated = options.updated ?? {
      content: "updated content",
      id: featureRequest ? featureRequest.id : 0,
      updatedAt: new Date().toISOString(),
    };
    const returning = vi.fn().mockResolvedValue([defaultUpdated]);
    const where = vi.fn(() => ({ returning }));
    const set = vi.fn(() => ({ where }));
    const updateMock = vi.fn(() => ({ set }));

    const db = {
      query: {
        featureRequests: {
          findFirst,
        },
      },
      update: updateMock,
    } as unknown as Database;

    const resolvedSession =
      options.sessionUserId === undefined
        ? ({
            expires: new Date().toISOString(),
            user: { id: featureRequest?.userId ?? "owner-user" },
          } as Session)
        : options.sessionUserId === null
          ? null
          : ({
              expires: new Date().toISOString(),
              user: { id: options.sessionUserId },
            } as Session);

    const caller = createCaller({
      db,
      headers: new Headers(),
      session: resolvedSession,
    });

    return { caller, findFirst, returning, set, updateMock, where };
  };

  it("updates content when owner requests it", async () => {
    const harness = createUpdateHarness();

    const result = await harness.caller.update({
      content: "  New content  ",
      id: 9,
    });

    expect(harness.findFirst).toHaveBeenCalledWith({
      columns: { id: true, productId: true, userId: true },
      where: expect.any(Function),
    });
    expect(harness.updateMock).toHaveBeenCalledWith(featureRequests);
    expect(harness.set).toHaveBeenCalledWith({ content: "New content" });
    expect(harness.returning).toHaveBeenCalledWith({
      content: featureRequests.content,
      id: featureRequests.id,
      updatedAt: featureRequests.updatedAt,
    });
    expect(result).toEqual({
      content: expect.any(String),
      id: 9,
      updatedAt: expect.any(String),
    });
  });

  it("throws FORBIDDEN when a different user attempts update", async () => {
    const harness = createUpdateHarness({ sessionUserId: "other-user" });

    await expect(
      harness.caller.update({ content: "ok", id: 9 }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });

    expect(harness.updateMock).not.toHaveBeenCalled();
  });

  it("throws NOT_FOUND when the feature request is missing", async () => {
    const harness = createUpdateHarness({ featureRequest: null });

    await expect(
      harness.caller.update({ content: "ok", id: 999 }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });

    expect(harness.updateMock).not.toHaveBeenCalled();
  });
});
