import fc from "fast-check";
import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";

import {
  avatarImageUrlSchema,
  idSchema,
  positiveIntSchema,
  productDescriptionSchema,
  productLogoUrlSchema,
  productNameSchema,
  reactionActionSchema,
  reactionAnonymousIdentifierSchema,
  reactionEmojiSchema,
} from "./base";

const isPositiveInteger = (value: number) =>
  Number.isInteger(value) && value >= 1;

describe("idSchema (property)", () => {
  it("accepts strings that parse to positive integers", () => {
    fc.assert(
      fc.property(fc.integer({ max: 1_000_000, min: 1 }), (value) => {
        const result = safeParse(idSchema, value.toString());
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.output).toBe(value);
        }
      }),
    );
  });

  it("rejects strings that do not parse to positive integers", () => {
    fc.assert(
      fc.property(fc.string(), (value) => {
        const numeric = Number(value);
        fc.pre(!isPositiveInteger(numeric) || !Number.isFinite(numeric));
        expect(safeParse(idSchema, value).success).toBe(false);
      }),
    );
  });
});

describe("positiveIntSchema (property)", () => {
  it("accepts positive integers", () => {
    fc.assert(
      fc.property(fc.integer({ max: 1_000_000, min: 1 }), (value) => {
        const result = safeParse(positiveIntSchema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.output).toBe(value);
        }
      }),
    );
  });

  it("rejects non-positive or non-integer numbers", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.double({ noNaN: false }),
          fc.constant(Number.POSITIVE_INFINITY),
          fc.constant(Number.NEGATIVE_INFINITY),
        ),
        (value) => {
          fc.pre(!isPositiveInteger(value));
          expect(safeParse(positiveIntSchema, value).success).toBe(false);
        },
      ),
    );
  });
});

describe("productNameSchema (property)", () => {
  it("accepts strings whose trimmed length is within 1..256", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 300 }), (value) => {
        const trimmed = value.trim();
        fc.pre(trimmed.length >= 1 && trimmed.length <= 256);
        const result = safeParse(productNameSchema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.output).toBe(trimmed);
        }
      }),
    );
  });

  it("rejects strings whose trimmed length is 0 or >256", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 400 }), (value) => {
        const trimmed = value.trim();
        fc.pre(trimmed.length === 0 || trimmed.length > 256);
        expect(safeParse(productNameSchema, value).success).toBe(false);
      }),
    );
  });
});

describe("productLogoUrlSchema (property)", () => {
  it("accepts strings up to 2048 after trimming", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 2300 }), (value) => {
        const trimmed = value.trim();
        fc.pre(trimmed.length <= 2048);
        const result = safeParse(productLogoUrlSchema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.output).toBe(trimmed);
        }
      }),
    );
  });

  it("rejects strings longer than 2048 after trimming", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 2300, minLength: 2049 }), (value) => {
        const trimmed = value.trim();
        fc.pre(trimmed.length > 2048);
        expect(safeParse(productLogoUrlSchema, value).success).toBe(false);
      }),
    );
  });
});

describe("productDescriptionSchema (property)", () => {
  it("accepts strings up to 5000 after trimming", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 5200 }), (value) => {
        const trimmed = value.trim();
        fc.pre(trimmed.length <= 5000);
        const result = safeParse(productDescriptionSchema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.output).toBe(trimmed);
        }
      }),
    );
  });

  it("rejects strings longer than 5000 after trimming", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 5200, minLength: 5001 }), (value) => {
        const trimmed = value.trim();
        fc.pre(trimmed.length > 5000);
        expect(safeParse(productDescriptionSchema, value).success).toBe(false);
      }),
    );
  });
});

describe("avatarImageUrlSchema (property)", () => {
  it("accepts strings up to 255 after trimming", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 300 }), (value) => {
        const trimmed = value.trim();
        fc.pre(trimmed.length <= 255);
        const result = safeParse(avatarImageUrlSchema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.output).toBe(trimmed);
        }
      }),
    );
  });

  it("rejects strings longer than 255 after trimming", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 300, minLength: 256 }), (value) => {
        const trimmed = value.trim();
        fc.pre(trimmed.length > 255);
        expect(safeParse(avatarImageUrlSchema, value).success).toBe(false);
      }),
    );
  });
});

describe("reaction schemas (property)", () => {
  it("accepts only up/down actions", () => {
    fc.assert(
      fc.property(fc.constantFrom("up", "down"), (value) => {
        expect(safeParse(reactionActionSchema, value).success).toBe(true);
      }),
    );

    fc.assert(
      fc.property(fc.string(), (value) => {
        fc.pre(value !== "up" && value !== "down");
        expect(safeParse(reactionActionSchema, value).success).toBe(false);
      }),
    );
  });

  it("enforces emoji and anonymous identifier lengths", () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 40 }), (value) => {
        fc.pre(value.length >= 1 && value.length <= 32);
        expect(safeParse(reactionEmojiSchema, value).success).toBe(true);
      }),
    );

    fc.assert(
      fc.property(fc.string({ maxLength: 40, minLength: 33 }), (value) => {
        fc.pre(value.length > 32);
        expect(safeParse(reactionEmojiSchema, value).success).toBe(false);
      }),
    );

    fc.assert(
      fc.property(fc.string({ maxLength: 300 }), (value) => {
        fc.pre(value.length >= 1 && value.length <= 255);
        expect(
          safeParse(reactionAnonymousIdentifierSchema, value).success,
        ).toBe(true);
      }),
    );

    fc.assert(
      fc.property(fc.string({ maxLength: 300, minLength: 256 }), (value) => {
        fc.pre(value.length > 255);
        expect(
          safeParse(reactionAnonymousIdentifierSchema, value).success,
        ).toBe(false);
      }),
    );
  });
});
