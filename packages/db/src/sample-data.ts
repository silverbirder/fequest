import { featureRequests, products } from "./schema";
import type { Database } from "./client";

const DEFAULT_PRODUCT_NAME = "サンプルプロダクト";
const DEFAULT_FEATURE_REQUEST_CONTENT =
  "新しいアカウントにシードされたサンプル機能リクエスト。";

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

    await tx.insert(featureRequests).values({
      productId: product.id,
      userId,
      content: featureRequestContent,
    });
  });
};
