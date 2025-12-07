import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";

import {
  createFeatureRequestSchema,
  featureRequestTitleSchema,
  idSchema,
  positiveIntSchema,
  productDescriptionSchema,
  productLogoUrlSchema,
  productNameSchema,
  reactionActionSchema,
  setFeatureStatusSchema,
  updateProductDetailsSchema,
} from "./base";

const invalidMessage = "Invalid ID";

describe("idSchema", () => {
  it("parses a numeric string into an integer", () => {
    const result = safeParse(idSchema, "42");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe(42);
    }
  });

  it("rejects non-numeric strings", () => {
    const result = safeParse(idSchema, "abc");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe(invalidMessage);
    }
  });

  it("rejects integers less than one", () => {
    for (const input of ["0", "-1"]) {
      const result = safeParse(idSchema, input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0]?.message).toBe(invalidMessage);
      }
    }
  });

  it("rejects decimal values", () => {
    const result = safeParse(idSchema, "3.14");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe(invalidMessage);
    }
  });
});

describe("positiveIntSchema", () => {
  it("accepts positive integers", () => {
    const result = safeParse(positiveIntSchema, 3);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe(3);
    }
  });

  it("rejects zero or negative", () => {
    expect(safeParse(positiveIntSchema, 0).success).toBe(false);
    expect(safeParse(positiveIntSchema, -5).success).toBe(false);
  });
});

describe("productNameSchema", () => {
  it("trims and requires content", () => {
    const result = safeParse(productNameSchema, "  Roadmap ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe("Roadmap");
    }
  });

  it("rejects empty", () => {
    expect(safeParse(productNameSchema, "   ").success).toBe(false);
  });
});

describe("productLogoUrlSchema", () => {
  it("trims whitespace and allows empty string", () => {
    const result = safeParse(
      productLogoUrlSchema,
      "  https://example.com/logo.png  ",
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe("https://example.com/logo.png");
    }
  });

  it("rejects overly long values", () => {
    const longValue = "h".repeat(3000);
    expect(safeParse(productLogoUrlSchema, longValue).success).toBe(false);
  });
});

describe("productDescriptionSchema", () => {
  it("trims and keeps text within limit", () => {
    const result = safeParse(
      productDescriptionSchema,
      "  Explain the product  ",
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe("Explain the product");
    }
  });

  it("rejects values beyond max length", () => {
    const overLimit = "d".repeat(6000);
    expect(safeParse(productDescriptionSchema, overLimit).success).toBe(false);
  });
});

describe("updateProductDetailsSchema", () => {
  it("accepts optional metadata with trimming", () => {
    const result = safeParse(updateProductDetailsSchema, {
      description: "  A helpful summary  ",
      id: 12,
      logoUrl: "  https://cdn.example.com/logo.svg  ",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.description).toBe("A helpful summary");
      expect(result.output.logoUrl).toBe("https://cdn.example.com/logo.svg");
    }
  });

  it("allows omitting optional fields", () => {
    const result = safeParse(updateProductDetailsSchema, { id: 7 });
    expect(result.success).toBe(true);
  });
});

describe("featureRequestTitleSchema", () => {
  it("trims and limits length", () => {
    const result = safeParse(featureRequestTitleSchema, "  Title ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe("Title");
    }
  });
});

describe("createFeatureRequestSchema", () => {
  it("validates shape", () => {
    const result = safeParse(createFeatureRequestSchema, {
      productId: 1,
      title: "Export CSV",
    });
    expect(result.success).toBe(true);
  });
});

describe("reactionActionSchema", () => {
  it("only allows up/down", () => {
    expect(safeParse(reactionActionSchema, "up").success).toBe(true);
    expect(safeParse(reactionActionSchema, "down").success).toBe(true);
    expect(safeParse(reactionActionSchema, "sideways").success).toBe(false);
  });
});

describe("setFeatureStatusSchema", () => {
  const schema = setFeatureStatusSchema(["open", "closed"] as const);

  it("accepts allowed status", () => {
    expect(safeParse(schema, { featureId: 10, status: "open" }).success).toBe(
      true,
    );
  });

  it("rejects invalid status", () => {
    expect(
      safeParse(schema, { featureId: 10, status: "pending" }).success,
    ).toBe(false);
  });
});
