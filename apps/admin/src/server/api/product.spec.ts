import type { Database } from "@repo/db";
import type { Session } from "next-auth";

import { TRPCError } from "@trpc/server";
import { afterEach, describe, expect, it, vi } from "vitest";

let mockSession: null | Session = null;

vi.mock("~/server/auth", () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
}));

vi.mock("~/server/db", () => ({
  db: {},
}));

const [{ createCallerFactory }, { productRouter }] = await Promise.all([
  import("./trpc"),
  import("./product"),
]);

const createCaller = createCallerFactory(productRouter);

type HarnessOptions = {
  products?: unknown[];
  session?: null | Session;
};

const createTestHarness = (options: HarnessOptions = {}) => {
  const findMany = vi.fn().mockResolvedValue(options.products ?? []);

  const db = {
    query: {
      products: {
        findMany,
      },
    },
  } as unknown as Database;

  const headers = new Headers();

  mockSession = options.session ?? null;

  const caller = createCaller({
    db,
    headers,
    session: mockSession,
  });

  return { caller, findMany };
};

afterEach(() => {
  // Keep module mocks but reset call counts/spies between tests
  vi.clearAllMocks();
});

describe("productRouter.list", () => {
  it("returns summaries for the signed-in user's products", async () => {
    const products = [
      {
        featureRequests: [
          { id: 1, reactions: [{ id: 1 }, { id: 2 }] },
          { id: 2, reactions: [] },
        ],
        id: 10,
        name: "Alpha",
      },
    ];

    const { caller, findMany } = createTestHarness({
      products,
      session: {
        expires: "",
        user: { id: "user-1", name: "Tester" },
      },
    });

    const result = await caller.list();

    const queryOptions = findMany.mock.calls[0]?.[0];
    expect(queryOptions).toBeDefined();
    expect(queryOptions?.with).toEqual({
      featureRequests: {
        columns: { id: true },
        with: {
          reactions: {
            columns: { id: true },
          },
        },
      },
    });

    const eq = vi.fn();
    queryOptions?.where?.(
      { userId: "product.userId" } as never,
      { eq } as never,
    );
    expect(eq).toHaveBeenCalledWith("product.userId", "user-1");

    expect(result).toEqual([
      {
        featureCount: 2,
        id: 10,
        name: "Alpha",
        reactionCount: 2,
      },
    ]);
  });

  it("returns an empty array when the user has no products", async () => {
    const { caller } = createTestHarness({
      products: [],
      session: {
        expires: "",
        user: { id: "user-1", name: "Tester" },
      },
    });

    await expect(caller.list()).resolves.toEqual([]);
  });

  it("throws UNAUTHORIZED when called without a session", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(caller.list()).rejects.toBeInstanceOf(TRPCError);
    await expect(caller.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
