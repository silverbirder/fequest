import type { Database } from "@repo/db";
import type { Session } from "next-auth";

import { ANONYMOUS_IDENTIFIER_COOKIE_NAME } from "@repo/user-cookie";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("~/server/auth", () => ({
  auth: async () => null,
}));

vi.mock("~/server/db", () => ({
  db: {},
}));

const [{ createCallerFactory }, { productRouter }] = await Promise.all([
  import("../trpc"),
  import("./product"),
]);

const createCaller = createCallerFactory(productRouter);

type HarnessOptions = {
  cookies?: Record<string, string>;
  product?: unknown;
  products?: unknown[];
  session?: null | Session;
};

const createTestHarness = (options: HarnessOptions = {}) => {
  const findFirst = vi.fn().mockResolvedValue(options.product);
  const findMany = vi.fn().mockResolvedValue(options.products ?? []);
  const db = {
    query: {
      products: {
        findFirst,
        findMany,
      },
    },
  } as unknown as Database;

  const headers = new Headers();
  if (options.cookies) {
    const cookieHeader = Object.entries(options.cookies)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("; ");
    headers.set("cookie", cookieHeader);
  }

  const caller = createCaller({
    db,
    headers,
    session: options.session ?? null,
  });

  return { caller, findFirst, findMany };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("productRouter.byId", () => {
  it("returns the product with feature requests including their reactions", async () => {
    const productRecord = {
      featureRequests: [
        {
          id: 1,
          reactions: [
            {
              anonymousIdentifier: null,
              emoji: "👍",
              userId: "viewer",
            },
            {
              anonymousIdentifier: "anon-1",
              emoji: "🎉",
              userId: null,
            },
          ],
        },
      ],
      id: 42,
      name: "Demo Product",
    };
    const { caller, findFirst } = createTestHarness({
      product: productRecord,
      session: {
        expires: "",
        user: {
          id: "viewer",
          name: "Test",
        },
      },
    });

    const result = await caller.byId({ id: 42 });

    const queryOptions = findFirst.mock.calls[0]?.[0];
    expect(queryOptions).toBeDefined();
    expect(queryOptions?.with).toEqual({
      featureRequests: {
        columns: {
          content: true,
          createdAt: true,
          id: true,
          status: true,
          title: true,
          updatedAt: true,
        },
        orderBy: expect.any(Function),
        with: {
          reactions: {
            orderBy: expect.any(Function),
            with: {
              user: {
                columns: {
                  id: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
          user: {
            columns: {
              id: true,
              image: true,
              name: true,
            },
          },
        },
      },
    });

    const eq = vi.fn();
    queryOptions?.where?.({ id: "product.id" } as unknown, { eq } as never);
    expect(eq).toHaveBeenCalledWith("product.id", 42);

    const firstFeature = productRecord.featureRequests[0] as Record<
      string,
      unknown
    >;
    const featureWithoutReactions = { ...firstFeature };
    delete featureWithoutReactions.reactions;

    expect(result).toEqual({
      ...productRecord,
      featureRequests: [
        {
          ...featureWithoutReactions,
          reactionSummaries: [
            { count: 1, emoji: "👍", reactedByViewer: true },
            { count: 1, emoji: "🎉", reactedByViewer: false },
          ],
        },
      ],
    });
  });

  it("marks anonymous viewer reactions when identifier is provided", async () => {
    const productRecord = {
      featureRequests: [
        {
          id: 1,
          reactions: [
            {
              anonymousIdentifier: "anon-1",
              emoji: "👍",
              userId: null,
            },
          ],
        },
      ],
      id: 42,
      name: "Demo Product",
    };
    const { caller } = createTestHarness({
      cookies: { [ANONYMOUS_IDENTIFIER_COOKIE_NAME]: "anon-1" },
      product: productRecord,
    });

    const result = await caller.byId({ id: 42 });

    expect(result?.featureRequests[0]?.reactionSummaries).toEqual([
      { count: 1, emoji: "👍", reactedByViewer: true },
    ]);
  });

  it("returns reaction summaries ordered by reaction id", async () => {
    const productRecord = {
      featureRequests: [
        {
          id: 1,
          reactions: [
            {
              anonymousIdentifier: null,
              emoji: "🎉",
              id: 3,
              userId: "user-1",
            },
            {
              anonymousIdentifier: null,
              emoji: "👍",
              id: 1,
              userId: "user-2",
            },
            {
              anonymousIdentifier: null,
              emoji: "🎉",
              id: 4,
              userId: "user-3",
            },
            {
              anonymousIdentifier: null,
              emoji: "👍",
              id: 2,
              userId: "user-4",
            },
          ],
        },
      ],
      id: 42,
      name: "Demo Product",
    };

    const { caller } = createTestHarness({
      product: productRecord,
      session: {
        expires: "",
        user: {
          id: "viewer",
          name: "Test",
        },
      },
    });

    const result = await caller.byId({ id: 42 });

    expect(result?.featureRequests[0]?.reactionSummaries).toEqual([
      { count: 2, emoji: "👍", reactedByViewer: false },
      { count: 2, emoji: "🎉", reactedByViewer: false },
    ]);
  });

  it("returns null when no product matches the supplied id", async () => {
    const { caller } = createTestHarness({ product: undefined });

    await expect(caller.byId({ id: 999 })).resolves.toBeNull();
  });
});

describe("productRouter.list", () => {
  it("returns public product summaries ordered by creation date", async () => {
    const productRecords = [
      {
        featureRequests: [
          {
            id: 1,
            reactions: [{ id: 10 }, { id: 11 }],
          },
          {
            id: 2,
            reactions: [],
          },
        ],
        id: 1,
        name: "First",
      },
      {
        featureRequests: [],
        id: 2,
        name: "Second",
      },
    ];

    const { caller, findMany } = createTestHarness({
      products: productRecords,
    });

    const result = await caller.list();

    expect(findMany).toHaveBeenCalled();
    const queryOptions = findMany.mock.calls[0]?.[0];
    expect(queryOptions?.columns).toEqual({
      id: true,
      logoUrl: true,
      name: true,
    });
    expect(
      queryOptions?.with?.featureRequests?.with?.reactions?.columns,
    ).toEqual({
      id: true,
    });

    expect(result).toEqual([
      {
        featureCount: 2,
        id: 1,
        logoUrl: undefined,
        name: "First",
        reactionCount: 2,
      },
      {
        featureCount: 0,
        id: 2,
        logoUrl: undefined,
        name: "Second",
        reactionCount: 0,
      },
    ]);
  });
});
