import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type DeleteFeatureRequestOptions = {
  productId: number;
};

export const createDeleteFeatureRequest = ({
  productId,
}: DeleteFeatureRequestOptions) => {
  return async (formData: FormData) => {
    "use server";

    const featureId = Number(formData.get("featureId"));
    const submittedProductId = Number(formData.get("productId"));

    if (
      !Number.isInteger(featureId) ||
      featureId <= 0 ||
      submittedProductId !== productId
    ) {
      return;
    }

    try {
      await api.product.deleteFeatureRequest({ featureId });
    } catch (error) {
      console.error("Failed to delete feature request", error);
    }

    revalidatePath(`/products/${productId}`);
  };
};

export type DeleteFeatureRequest = ReturnType<
  typeof createDeleteFeatureRequest
>;
