import type { Database } from "@repo/db";
import type { Session } from "next-auth";

import {
  featureRequestAdminComments,
  featureRequests,
  products,
} from "@repo/db/schema";
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
  insertedProducts?: unknown[];
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
  const insertProductsReturning = vi
    .fn()
    .mockResolvedValue(options.insertedProducts ?? []);

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

  const featureDeleteWhere = vi.fn();
  const featureCommentDeleteWhere = vi.fn();

  const update = vi.fn((table) => {
    if (table === products) {
      return { set: productUpdateSet };
    }
    if (table === featureRequests) {
      return { set: featureUpdateSet };
    }
    throw new Error("Unexpected table");
  });

  const deleteWhere = vi.fn((table) => {
    if (table === featureRequests) {
      return { where: featureDeleteWhere };
    }
    if (table === featureRequestAdminComments) {
      return { where: featureCommentDeleteWhere };
    }
    throw new Error("Unexpected table");
  });

  const insertValues = vi.fn(() => ({
    returning: insertProductsReturning,
  }));
  const insertFeatureCommentValues = vi.fn();

  const insert = vi.fn((table) => {
    if (table === products) {
      return { values: insertValues };
    }
    if (table === featureRequestAdminComments) {
      return { values: insertFeatureCommentValues };
    }
    throw new Error("Unexpected table");
  });

  const db = {
    delete: deleteWhere,
    insert,
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
    featureCommentDeleteWhere,
    featureDeleteWhere,
    featureUpdateWhere,
    findFirstFeatureRequest,
    findFirstProduct,
    findMany,
    insert,
    insertFeatureCommentValues,
    insertProductsReturning,
    insertValues,
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
      description: "Helpful product",
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
      logoUrl: "https://cdn.example.com/logo.png",
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
      description: "Helpful product",
      featureRequests: [
        {
          adminComment: null,
          ...product.featureRequests[0],
          reactionSummaries: [],
        },
      ],
      homePageUrl: undefined,
      id: 5,
      logoUrl: "https://cdn.example.com/logo.png",
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

describe("productRouter.updateFeatureComment", () => {
  it("stores a comment when feature belongs to the product owner", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));
    const { caller, featureCommentDeleteWhere, insertFeatureCommentValues } =
      createTestHarness({
        featureRequest: {
          id: 11,
          product: {
            name: "My Product",
            userId: "user-1",
            watchers: [
              {
                user: { webhookUrl: "https://hooks.slack.com/services/T/B/W1" },
                userId: "watcher-1",
              },
              {
                user: { webhookUrl: "https://hooks.slack.com/services/T/B/W2" },
                userId: "watcher-2",
              },
            ],
          },
          productId: 2,
          title: "通知が欲しい",
          user: { webhookUrl: "https://hooks.slack.com/services/T/B/CREATOR" },
        },
        session: {
          expires: "",
          user: { id: "user-1", name: "Owner" },
        },
      });

    const result = await caller.updateFeatureComment({
      comment: "  対応予定です  ",
      featureId: 11,
    });

    expect(featureCommentDeleteWhere).toHaveBeenCalled();
    expect(insertFeatureCommentValues).toHaveBeenCalledWith({
      adminUserId: "user-1",
      content: "対応予定です",
      featureRequestId: 11,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://hooks.slack.com/services/T/B/CREATOR",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://hooks.slack.com/services/T/B/W1",
      expect.objectContaining({ method: "POST" }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      "https://hooks.slack.com/services/T/B/W2",
      expect.objectContaining({ method: "POST" }),
    );
    const firstPayload = JSON.parse(
      String(fetchMock.mock.calls[0]?.[1]?.body ?? ""),
    );
    expect(firstPayload.text).toContain("My Product");
    expect(firstPayload.text).toContain("通知が欲しい");
    expect(result).toEqual({
      comment: "対応予定です",
      featureId: 11,
      productId: 2,
    });
    fetchMock.mockRestore();
  });

  it("clears a comment when empty string is submitted", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response(null, { status: 200 }));
    const { caller, featureCommentDeleteWhere, insertFeatureCommentValues } =
      createTestHarness({
        featureRequest: {
          id: 12,
          product: { name: "My Product", userId: "user-1", watchers: [] },
          productId: 5,
          title: "すでにあるコメント",
          user: { webhookUrl: "https://hooks.slack.com/services/T/B/CREATOR" },
        },
        session: {
          expires: "",
          user: { id: "user-1", name: "Owner" },
        },
      });

    const result = await caller.updateFeatureComment({
      comment: "   ",
      featureId: 12,
    });

    expect(featureCommentDeleteWhere).toHaveBeenCalled();
    expect(insertFeatureCommentValues).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://hooks.slack.com/services/T/B/CREATOR",
      expect.objectContaining({ method: "POST" }),
    );
    const firstPayload = JSON.parse(
      String(fetchMock.mock.calls[0]?.[1]?.body ?? ""),
    );
    expect(firstPayload.text).toContain("My Product");
    expect(firstPayload.text).toContain("すでにあるコメント");
    expect(result).toEqual({
      comment: null,
      featureId: 12,
      productId: 5,
    });
    fetchMock.mockRestore();
  });

  it("throws NOT_FOUND when feature is missing or not owned", async () => {
    const { caller } = createTestHarness({
      featureRequest: null,
      session: {
        expires: "",
        user: { id: "user-1", name: "Owner" },
      },
    });

    await expect(
      caller.updateFeatureComment({
        comment: "test",
        featureId: 3,
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects when no session is present", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(
      caller.updateFeatureComment({
        comment: "test",
        featureId: 3,
      }),
    ).rejects.toBeInstanceOf(TRPCError);
  });
});

describe("productRouter.create", () => {
  it("inserts a product for the signed-in user", async () => {
    const { caller, insertProductsReturning, insertValues } = createTestHarness(
      {
        insertedProducts: [{ id: 9, name: "New Product" }],
        session: {
          expires: "",
          user: { id: "user-1", name: "Tester" },
        },
      },
    );

    const result = await caller.create({ name: "  New Product  " });

    expect(insertValues).toHaveBeenCalledWith({
      name: "New Product",
      userId: "user-1",
    });
    expect(insertProductsReturning).toHaveBeenCalled();
    expect(result).toEqual({ id: 9, name: "New Product" });
  });

  it("throws INTERNAL_SERVER_ERROR when insert returns no rows", async () => {
    const { caller } = createTestHarness({
      insertedProducts: [],
      session: {
        expires: "",
        user: { id: "user-1", name: "Tester" },
      },
    });

    await expect(caller.create({ name: "Missing" })).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
    });
  });

  it("rejects when called without a session", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(caller.create({ name: "Prod" })).rejects.toBeInstanceOf(
      TRPCError,
    );
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

describe("productRouter.updateDetails", () => {
  it("updates logo and description for owned product", async () => {
    const {
      caller,
      findFirstProduct,
      productUpdateSet,
      updateProductsReturning,
    } = createTestHarness({
      product: { id: 6, name: "Alpha", userId: "user-1" },
      session: {
        expires: "",
        user: { id: "user-1", name: "Owner" },
      },
      updatedProducts: [
        {
          description: "New description",
          homePageUrl: null,
          id: 6,
          logoUrl: "https://logo.new/img.png",
          name: "Alpha",
        },
      ],
    });

    const result = await caller.updateDetails({
      description: "  New description  ",
      id: 6,
      logoUrl: " https://logo.new/img.png ",
    });

    expect(findFirstProduct).toHaveBeenCalled();
    expect(productUpdateSet).toHaveBeenCalledWith({
      description: "New description",
      logoUrl: "https://logo.new/img.png",
    });
    expect(updateProductsReturning).toHaveBeenCalled();
    expect(result).toEqual({
      description: "New description",
      homePageUrl: null,
      id: 6,
      logoUrl: "https://logo.new/img.png",
      name: "Alpha",
    });
  });

  it("returns existing product when no updatable fields provided", async () => {
    const existing = {
      description: "Keep me",
      id: 8,
      logoUrl: "https://old/logo.png",
      name: "Omega",
      userId: "user-1",
    };

    const { caller, productUpdateSet, updateProductsReturning } =
      createTestHarness({
        product: existing,
        session: {
          expires: "",
          user: { id: "user-1", name: "Owner" },
        },
      });

    const result = await caller.updateDetails({ id: 8 });

    expect(productUpdateSet).not.toHaveBeenCalled();
    expect(updateProductsReturning).not.toHaveBeenCalled();
    expect(result).toEqual(existing);
  });

  it("throws NOT_FOUND when product is missing or not owned", async () => {
    const { caller } = createTestHarness({
      product: null,
      session: {
        expires: "",
        user: { id: "user-1", name: "Owner" },
      },
    });

    await expect(
      caller.updateDetails({ id: 12, logoUrl: "https://x" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("rejects when no session is present", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(
      caller.updateDetails({ id: 3, logoUrl: "https://x" }),
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

describe("productRouter.deleteFeatureRequest", () => {
  it("deletes a feature request belonging to the user's product", async () => {
    const { caller, featureDeleteWhere, findFirstFeatureRequest } =
      createTestHarness({
        featureRequest: {
          id: 21,
          product: { userId: "user-1" },
          productId: 5,
        },
        session: {
          expires: "",
          user: { id: "user-1", name: "Owner" },
        },
      });

    const result = await caller.deleteFeatureRequest({ featureId: 21 });

    expect(findFirstFeatureRequest).toHaveBeenCalled();
    expect(featureDeleteWhere).toHaveBeenCalled();
    expect(result).toEqual({ id: 21, productId: 5 });
  });

  it("throws NOT_FOUND when the feature request is missing or not owned", async () => {
    const { caller } = createTestHarness({
      featureRequest: {
        id: 22,
        product: { userId: "someone-else" },
        productId: 9,
      },
      session: {
        expires: "",
        user: { id: "user-1", name: "Owner" },
      },
    });

    await expect(
      caller.deleteFeatureRequest({ featureId: 22 }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("throws UNAUTHORIZED when no session is present", async () => {
    const { caller } = createTestHarness({ session: null });

    await expect(
      caller.deleteFeatureRequest({ featureId: 3 }),
    ).rejects.toBeInstanceOf(TRPCError);
  });
});
