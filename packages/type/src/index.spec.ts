import { describe, expectTypeOf, it } from "vitest";

import {
  FeatureRequestCore,
  FeatureRequestStatus,
  FeatureRequestUser,
  ProductSummary,
} from "./index";

describe("type contracts", () => {
  it("ProductSummary keeps the shared product shape", () => {
    expectTypeOf<ProductSummary>().toMatchTypeOf<{
      featureCount: number;
      id: number;
      name: string;
      reactionCount: number;
    }>();
  });

  it("FeatureRequestCore keeps the base feature fields", () => {
    expectTypeOf<FeatureRequestCore>().toMatchTypeOf<{
      content: string;
      createdAt?: Date | null | string;
      id: number;
      status: FeatureRequestStatus;
      title?: null | string;
      updatedAt?: Date | null | string;
    }>();
  });

  it("FeatureRequestStatus reflects current feature lifecycle", () => {
    expectTypeOf<FeatureRequestStatus>().toEqualTypeOf<"closed" | "open">();
  });

  it("FeatureRequestUser keeps optional identity fields", () => {
    expectTypeOf<FeatureRequestUser>().toMatchTypeOf<{
      id?: null | string;
      image?: null | string;
      name?: null | string;
    }>();
  });
});
