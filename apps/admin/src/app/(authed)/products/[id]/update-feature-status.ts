import { setFeatureStatusSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { safeParse } from "valibot";

import { api } from "~/trpc/server";

type UpdateFeatureStatusOptions = {
  productId: number;
};

const featureStatusSchema = setFeatureStatusSchema(["open", "closed"] as const);

export const createUpdateFeatureStatus = ({
  productId,
}: UpdateFeatureStatusOptions) => {
  return async (formData: FormData) => {
    "use server";

    const featureId = Number(formData.get("featureId"));
    const status = formData.get("status");

    const parsed = safeParse(featureStatusSchema, {
      featureId,
      status,
    });
    if (!parsed.success) {
      return;
    }

    try {
      await api.product.setFeatureStatus(parsed.output);
    } catch (error) {
      console.error("Failed to update feature status", error);
    }

    revalidatePath(`/products/${productId}`);
  };
};

export type UpdateFeatureStatus = ReturnType<typeof createUpdateFeatureStatus>;
