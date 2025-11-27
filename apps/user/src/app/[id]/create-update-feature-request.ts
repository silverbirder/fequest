import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type CreateUpdateFeatureRequestOptions = {
  productId: number;
};

export const createUpdateFeatureRequest = ({
  productId,
}: CreateUpdateFeatureRequestOptions) => {
  return async (formData: FormData) => {
    "use server";

    const featureId = Number(formData.get("featureId"));
    const content = formData.get("content");

    if (!Number.isInteger(featureId) || featureId <= 0) {
      return;
    }

    if (typeof content !== "string") {
      return;
    }

    try {
      await api.featureRequests.update({
        content: content.trim(),
        id: featureId,
      });
    } catch (error) {
      console.error("Failed to update feature request", error);
    }

    revalidatePath(`/${productId}`);
  };
};

export type UpdateFeatureRequest = ReturnType<
  typeof createUpdateFeatureRequest
>;
