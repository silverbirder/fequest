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
  session?: null | Session;
};

const createTestHarness = (options: HarnessOptions = {}) => {
  const findFirst = vi.fn().mockResolvedValue(options.product);
  const db = {
    query: {
      products: {
        findFirst,
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

  return { caller, findFirst };
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
      featureRequests: { with: { reactions: true } },
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

  it("returns null when no product matches the supplied id", async () => {
    const { caller } = createTestHarness({ product: undefined });

    await expect(caller.byId({ id: 999 })).resolves.toBeNull();
  });
});
