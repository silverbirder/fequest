import type { Database } from "@repo/db";
import type { Session } from "next-auth";

import { featureRequests, products } from "@repo/db/schema";
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
  featureRequest?: unknown;
  product?: unknown;
  products?: unknown[];
  session?: null | Session;
  updatedFeatureRequests?: unknown[];
  updatedProducts?: unknown[];
};

const createTestHarness = (options: HarnessOptions = {}) => {
  const findMany = vi.fn().mockResolvedValue(options.products ?? []);
  const findFirstProduct = vi.fn().mockResolvedValue(options.product ?? null);
  const findFirstFeatureRequest = vi
    .fn()
    .mockResolvedValue(options.featureRequest ?? null);

  const updateProductsReturning = vi
    .fn()
    .mockResolvedValue(options.updatedProducts ?? []);
  const updateFeatureRequestsReturning = vi
    .fn()
    .mockResolvedValue(options.updatedFeatureRequests ?? []);

  const productUpdateWhere = vi.fn(() => ({
    returning: updateProductsReturning,
  }));
  const productUpdateSet = vi.fn(() => ({
    where: productUpdateWhere,
  }));

  const featureUpdateWhere = vi.fn(() => ({
    returning: updateFeatureRequestsReturning,
  }));
  const featureUpdateSet = vi.fn(() => ({
    where: featureUpdateWhere,
  }));

  const update = vi.fn((table) => {
    if (table === products) {
      return { set: productUpdateSet };
    }
    if (table === featureRequests) {
      return { set: featureUpdateSet };
    }
    throw new Error("Unexpected table");
  });

  const db = {
    query: {
      featureRequests: {
        findFirst: findFirstFeatureRequest,
      },
      products: {
        findFirst: findFirstProduct,
        findMany,
      },
    },
    update,
  } as unknown as Database;

  const headers = new Headers();

  mockSession = options.session ?? null;

  const caller = createCaller({ db, headers, session: mockSession });

  return {
    caller,
    featureUpdateWhere,
    findFirstFeatureRequest,
    findFirstProduct,
    findMany,
    productUpdateSet,
    productUpdateWhere,
    update,
    updateFeatureRequestsReturning,
    updateProductsReturning,
  };
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

describe("productRouter.byId", () => {
  it("returns the product and its feature requests for the owner", async () => {
    const product = {
      featureRequests: [
        {
          content: "Request content",
          createdAt: "2024-01-01T00:00:00Z",
          id: 21,
          status: "open",
          title: "Request title",
          updatedAt: "2024-01-02T00:00:00Z",
        },
      ],
      id: 5,
      name: "Alpha",
    };

    const { caller, findFirstProduct } = createTestHarness({
      product,
      session: {
        expires: "",
        user: { id: "user-1", name: "Tester" },
      },
    });

    const result = await caller.byId({ id: 5 });

    const queryOptions = findFirstProduct.mock.calls[0]?.[0];
    const eq = vi.fn();
    const and = vi.fn();
    queryOptions?.where?.(
      { id: "product.id", userId: "product.userId" } as never,
      { and, eq } as never,
    );
    expect(eq).toHaveBeenCalledWith("product.id", 5);
    expect(eq).toHaveBeenCalledWith("product.userId", "user-1");

    expect(result).toEqual({
      featureRequests: product.featureRequests,
      id: 5,
      name: "Alpha",
    });
  });

  it("returns null when the product is not found", async () => {
    const { caller } = createTestHarness({
      product: null,
      session: {
        expires: "",
        user: { id: "user-1", name: "Tester" },
      },
    });

    await expect(caller.byId({ id: 99 })).resolves.toBeNull();
  });

  it("throws UNAUTHORIZED when no session exists", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(caller.byId({ id: 1 })).rejects.toBeInstanceOf(TRPCError);
  });
});

describe("productRouter.rename", () => {
  it("updates the product name when owned by the user", async () => {
    const { caller, productUpdateSet, updateProductsReturning } =
      createTestHarness({
        session: {
          expires: "",
          user: { id: "user-1", name: "Tester" },
        },
        updatedProducts: [{ id: 3, name: "New Name" }],
      });

    const result = await caller.rename({ id: 3, name: "  New Name  " });

    expect(productUpdateSet).toHaveBeenCalledWith({ name: "New Name" });
    expect(updateProductsReturning).toHaveBeenCalled();
    expect(result).toEqual({ id: 3, name: "New Name" });
  });

  it("throws NOT_FOUND when the update returns no rows", async () => {
    const { caller } = createTestHarness({
      session: {
        expires: "",
        user: { id: "user-1", name: "Tester" },
      },
      updatedProducts: [],
    });

    await expect(
      caller.rename({ id: 3, name: "Missing" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects when called without a session", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(
      caller.rename({ id: 3, name: "Invalid" }),
    ).rejects.toBeInstanceOf(TRPCError);
  });
});

describe("productRouter.setFeatureStatus", () => {
  it("updates the feature request status when owned by the user", async () => {
    const { caller, featureUpdateWhere, updateFeatureRequestsReturning } =
      createTestHarness({
        featureRequest: {
          id: 11,
          product: { userId: "user-1" },
          productId: 2,
          status: "open",
        },
        session: {
          expires: "",
          user: { id: "user-1", name: "Tester" },
        },
        updatedFeatureRequests: [{ id: 11, productId: 2, status: "closed" }],
      });

    const result = await caller.setFeatureStatus({
      featureId: 11,
      status: "closed",
    });

    expect(featureUpdateWhere).toHaveBeenCalled();
    expect(updateFeatureRequestsReturning).toHaveBeenCalled();
    expect(result).toEqual({ id: 11, productId: 2, status: "closed" });
  });

  it("throws NOT_FOUND when the feature does not belong to the user", async () => {
    const { caller } = createTestHarness({
      featureRequest: {
        id: 11,
        product: { userId: "someone-else" },
        productId: 2,
        status: "open",
      },
      session: {
        expires: "",
        user: { id: "user-1", name: "Tester" },
      },
    });

    await expect(
      caller.setFeatureStatus({ featureId: 11, status: "closed" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("throws UNAUTHORIZED when no session exists", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(
      caller.setFeatureStatus({ featureId: 11, status: "open" }),
    ).rejects.toBeInstanceOf(TRPCError);
  });
});
