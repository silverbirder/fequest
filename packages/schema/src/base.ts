import { integer, minValue, number, pipe, string, transform } from "valibot";

const invalidProductIdMessage = "Invalid ID";

export const idSchema = pipe(
  string(),
  transform((value): number => Number(value)),
  number(invalidProductIdMessage),
  integer(invalidProductIdMessage),
  minValue(1, invalidProductIdMessage),
);
