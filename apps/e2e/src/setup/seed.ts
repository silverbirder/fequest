import {
  createDbClient,
  featureRequestReactions,
  featureRequests,
  products,
  users,
} from "@repo/db";
import { randomUUID } from "node:crypto";

export type SeededProductData = {
  openFeatureTitle: string;
  productId: number;
  productName: string;
};

const buildUserRecord = (id: string) => ({
  email: `${id}@example.com`,
  id,
  name: "E2E User",
});

export const seedProductData = async (
  databaseUrl: string,
): Promise<SeededProductData> => {
  const db = createDbClient({ databaseUrl, nodeEnv: "test" });
  const userId = `e2e-user-${randomUUID()}`;

  await db.insert(users).values(buildUserRecord(userId));

  const [product] = await db
    .insert(products)
    .values({ name: "E2E Product", userId })
    .returning({ id: products.id, name: products.name });

  if (!product) {
    throw new Error("Failed to seed product for e2e test");
  }

  const openFeatureTitle = "E2E サンプル機能";
  const closedFeatureTitle = "E2E クローズ済み機能";

  const insertedFeatures = await db
    .insert(featureRequests)
    .values([
      {
        content: "自動テスト用のサンプル機能リクエストです。",
        productId: product.id,
        status: "open",
        title: openFeatureTitle,
        userId,
      },
      {
        content: "クローズ済みサンプル。",
        productId: product.id,
        status: "closed",
        title: closedFeatureTitle,
        userId,
      },
    ])
    .returning({ id: featureRequests.id, status: featureRequests.status });

  const openFeature = insertedFeatures.find(
    (feature) => feature.status === "open",
  );
  const closedFeature = insertedFeatures.find(
    (feature) => feature.status === "closed",
  );

  if (!openFeature || !closedFeature) {
    throw new Error("Failed to seed feature requests for e2e test");
  }

  await db.insert(featureRequestReactions).values([
    {
      emoji: "👍",
      featureRequestId: openFeature.id,
      userId,
    },
    {
      anonymousIdentifier: `anon-${product.id}`,
      emoji: "🎉",
      featureRequestId: closedFeature.id,
    },
  ]);

  return {
    openFeatureTitle,
    productId: product.id,
    productName: product.name,
  };
};
