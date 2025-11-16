import { describe, expect, it, vi } from "vitest";

import { seedSampleDataForUser } from "./sample-data";
import type { Database } from "./client";
import {
  featureRequestReactions,
  featureRequests,
  products,
  type FeatureRequestStatus,
} from "./schema";

type ProductInsertValues = {
  name: string;
  userId: string;
};

type FeatureRequestInsertValues = {
  productId: number;
  userId: string;
  status: FeatureRequestStatus;
  title: string;
  content: string;
};

type ReactionInsertValues = {
  featureRequestId: number;
  userId?: string;
  anonymousIdentifier?: string;
  emoji: string;
};

type HarnessOverrides = {
  productReturning?: Array<{ id: number }>;
  featureRequestReturning?: Array<{
    id: number;
    status: FeatureRequestStatus;
  }>;
};

type InsertRecords = {
  productValues?: ProductInsertValues;
  featureRequestValues?: FeatureRequestInsertValues[];
  reactionValues?: ReactionInsertValues[];
};

const createDbHarness = (overrides: HarnessOverrides = {}) => {
  const productReturning = overrides.productReturning ?? [{ id: 101 }];
  const featureRequestReturning = overrides.featureRequestReturning ?? [
    { id: 201, status: "open" as const },
    { id: 202, status: "closed" as const },
  ];

  const records: InsertRecords = {};

  const productValuesMock = vi.fn((values: ProductInsertValues) => {
    records.productValues = values;
    return {
      returning: vi.fn(async () => productReturning),
    };
  });

  const featureRequestValuesMock = vi.fn(
    (values: FeatureRequestInsertValues[]) => {
      records.featureRequestValues = values;
      return {
        returning: vi.fn(async () => featureRequestReturning),
      };
    },
  );

  const reactionValuesMock = vi.fn(async (values: ReactionInsertValues[]) => {
    records.reactionValues = values;
  });

  const insertMock = vi.fn((table: unknown) => {
    if (table === products) {
      return { values: productValuesMock };
    }

    if (table === featureRequests) {
      return { values: featureRequestValuesMock };
    }

    if (table === featureRequestReactions) {
      return { values: reactionValuesMock };
    }

    throw new Error("Unexpected table passed to insert");
  });

  type TransactionContext = {
    insert: typeof insertMock;
  };

  const tx: TransactionContext = { insert: insertMock };

  const transaction = vi.fn(
    async (callback: (tx: TransactionContext) => Promise<void>) => {
      await callback(tx);
    },
  );

  const db = { transaction } as unknown as Database;

  return {
    db,
    transaction,
    records,
    productReturning,
    featureRequestReturning,
  };
};

describe("seedSampleDataForUser", () => {
  it("creates a sample product, feature requests, and reactions with default copy", async () => {
    const userId = "user-123";
    const harness = createDbHarness();

    await seedSampleDataForUser(harness.db, userId);

    expect(harness.records.productValues).toEqual({
      name: "サンプルプロダクト",
      userId,
    });

    const seededProductId = harness.productReturning[0]!.id;
    expect(harness.records.featureRequestValues).toEqual([
      {
        productId: seededProductId,
        userId,
        status: "open",
        title: "新しいアカウントにシードされたサンプル機能リクエスト。",
        content: "新しいアカウントにシードされたサンプル機能リクエスト。",
      },
      {
        productId: seededProductId,
        userId,
        status: "closed",
        title: "クローズ済みのサンプル機能リクエスト。",
        content: "クローズ済みのサンプル機能リクエスト。",
      },
    ]);

    const openFeatureRequestId = harness.featureRequestReturning.find(
      (request) => request.status === "open",
    )!.id;
    const closedFeatureRequestId = harness.featureRequestReturning.find(
      (request) => request.status === "closed",
    )!.id;

    expect(harness.records.reactionValues).toEqual([
      {
        featureRequestId: openFeatureRequestId,
        userId,
        emoji: "👍",
      },
      {
        featureRequestId: closedFeatureRequestId,
        anonymousIdentifier: `seed-guest-${seededProductId}`,
        emoji: "🎉",
      },
    ]);
  });

  it("honors overrides for the seeded product name and feature request content", async () => {
    const customProductName = "Custom Product";
    const customFeatureRequestContent = "Please add search";
    const harness = createDbHarness();

    await seedSampleDataForUser(harness.db, "user-override", {
      productName: customProductName,
      featureRequestContent: customFeatureRequestContent,
    });

    expect(harness.records.productValues).toEqual({
      name: customProductName,
      userId: "user-override",
    });

    expect(harness.records.featureRequestValues?.[0]).toMatchObject({
      content: customFeatureRequestContent,
      title: customFeatureRequestContent,
    });
    expect(harness.records.featureRequestValues?.[1]).toMatchObject({
      content: "クローズ済みのサンプル機能リクエスト。",
      title: "クローズ済みのサンプル機能リクエスト。",
    });
  });

  it("throws if inserting the sample product fails", async () => {
    const harness = createDbHarness({ productReturning: [] });

    await expect(
      seedSampleDataForUser(harness.db, "user-error"),
    ).rejects.toThrow("Failed to insert sample product for new user");
  });

  it("throws if either sample feature request is missing", async () => {
    const harness = createDbHarness({
      featureRequestReturning: [{ id: 999, status: "open" }],
    });

    await expect(
      seedSampleDataForUser(harness.db, "user-error"),
    ).rejects.toThrow("Failed to insert sample feature requests");
  });
});
