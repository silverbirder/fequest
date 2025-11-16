import { featureRequestReactions, featureRequests, products } from "./schema";
import type { Database } from "./client";

const DEFAULT_PRODUCT_NAME = "サンプルプロダクト";
const DEFAULT_FEATURE_REQUEST_CONTENT =
  "新しいアカウントにシードされたサンプル機能リクエスト。";
const CLOSED_FEATURE_REQUEST_CONTENT = "クローズ済みのサンプル機能リクエスト。";

export type SeedSampleDataOptions = {
  productName?: string;
  featureRequestContent?: string;
};

export const seedSampleDataForUser = async (
  db: Database,
  userId: string,
  options: SeedSampleDataOptions = {},
): Promise<void> => {
  const productName = options.productName ?? DEFAULT_PRODUCT_NAME;
  const featureRequestContent =
    options.featureRequestContent ?? DEFAULT_FEATURE_REQUEST_CONTENT;

  await db.transaction(async (tx) => {
    const [product] = await tx
      .insert(products)
      .values({ name: productName, userId })
      .returning({ id: products.id });

    if (!product) {
      throw new Error("Failed to insert sample product for new user");
    }

    const seededFeatureRequests = await tx
      .insert(featureRequests)
      .values([
        {
          productId: product.id,
          userId,
          status: "open",
          title: featureRequestContent,
          content: featureRequestContent,
        },
        {
          productId: product.id,
          userId,
          status: "closed",
          title: CLOSED_FEATURE_REQUEST_CONTENT,
          content: CLOSED_FEATURE_REQUEST_CONTENT,
        },
      ])
      .returning({ id: featureRequests.id, status: featureRequests.status });

    const openFeatureRequest = seededFeatureRequests.find(
      (request) => request.status === "open",
    );
    const closedFeatureRequest = seededFeatureRequests.find(
      (request) => request.status === "closed",
    );

    if (!openFeatureRequest || !closedFeatureRequest) {
      throw new Error("Failed to insert sample feature requests");
    }

    await tx.insert(featureRequestReactions).values([
      {
        featureRequestId: openFeatureRequest.id,
        userId,
        emoji: "👍",
      },
      {
        featureRequestId: closedFeatureRequest.id,
        anonymousIdentifier: `seed-guest-${product.id}`,
        emoji: "🎉",
      },
    ]);
  });
};
