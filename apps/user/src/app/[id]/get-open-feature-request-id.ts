import { idSchema } from "@repo/schema";
import { safeParse } from "valibot";

type SearchParams = Record<string, string | string[] | undefined> | undefined;

export const getOpenFeatureRequestId = (searchParams: SearchParams) => {
  const raw = searchParams?.open;
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const parsed = safeParse(idSchema, candidate);
  return parsed.success ? parsed.output : null;
};
