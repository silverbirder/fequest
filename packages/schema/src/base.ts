import {
  integer,
  maxLength,
  minLength,
  minValue,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  trim,
} from "valibot";

const invalidIdMessage = "Invalid ID";

// Path param id that arrives as a string (e.g. from Next.js params)
export const idSchema = pipe(
  string(),
  transform((value): number => Number(value)),
  number(invalidIdMessage),
  integer(invalidIdMessage),
  minValue(1, invalidIdMessage),
);

// Positive integer when the input is already numeric (e.g. tRPC body)
export const positiveIntSchema = pipe(
  number(invalidIdMessage),
  integer(invalidIdMessage),
  minValue(1, invalidIdMessage),
);

export const productIdSchema = object({ id: positiveIntSchema });
export const featureRequestIdSchema = object({ id: positiveIntSchema });
export const featureRequestByProductSchema = object({
  id: positiveIntSchema,
  productId: positiveIntSchema,
});

export const productNameSchema = pipe(
  string(),
  trim(),
  minLength(1),
  maxLength(256),
);

export const productLogoUrlSchema = pipe(string(), trim(), maxLength(2048));

export const productDescriptionSchema = pipe(string(), trim(), maxLength(5000));

export const createProductSchema = object({ name: productNameSchema });
export const renameProductSchema = object({
  id: positiveIntSchema,
  name: productNameSchema,
});
export const updateProductDetailsSchema = object({
  description: optional(productDescriptionSchema),
  id: positiveIntSchema,
  logoUrl: optional(productLogoUrlSchema),
});
export const deleteProductSchema = object({ id: positiveIntSchema });
export const deleteProductFeatureRequestSchema = object({
  featureId: positiveIntSchema,
});

export const featureRequestTitleSchema = pipe(
  string(),
  trim(),
  minLength(1),
  maxLength(255),
);

export const featureRequestContentSchema = pipe(
  string(),
  transform((value) => value.trim()),
  minLength(0),
  maxLength(10000),
);

export const createFeatureRequestSchema = object({
  productId: positiveIntSchema,
  title: featureRequestTitleSchema,
});

export const updateFeatureRequestSchema = object({
  content: featureRequestContentSchema,
  id: positiveIntSchema,
  title: featureRequestTitleSchema,
});

export const deleteFeatureRequestSchema = featureRequestIdSchema;

export const reactionActionSchema = picklist(["up", "down"] as const);
export const reactionEmojiSchema = pipe(string(), minLength(1), maxLength(32));
export const reactionAnonymousIdentifierSchema = pipe(
  string(),
  minLength(1),
  maxLength(255),
);

export const reactToFeatureRequestSchema = object({
  action: reactionActionSchema,
  anonymousIdentifier: optional(reactionAnonymousIdentifierSchema),
  emoji: reactionEmojiSchema,
  id: positiveIntSchema,
});

export const setFeatureStatusSchema = <
  TStatuses extends readonly [string, ...string[]],
>(
  statuses: TStatuses,
) =>
  object({
    featureId: positiveIntSchema,
    status: picklist(statuses),
  });
