import type { Database } from "@repo/db";

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
  product?: unknown;
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

  const caller = createCaller({
    db,
    headers: new Headers(),
    session: null,
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
          reactions: [{ emoji: "👍" }],
        },
      ],
      id: 42,
      name: "Demo Product",
    };
    const { caller, findFirst } = createTestHarness({
      product: productRecord,
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

    expect(result).toEqual(productRecord);
  });

  it("returns null when no product matches the supplied id", async () => {
    const { caller } = createTestHarness({ product: undefined });

    await expect(caller.byId({ id: 999 })).resolves.toBeNull();
  });
});
