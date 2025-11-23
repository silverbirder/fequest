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
    if (!Number.isInteger(featureId) || featureId <= 0) {
      return;
    }

    try {
      await api.featureRequests.delete({ id: featureId });
    } catch (error) {
      console.error("Failed to delete feature request", error);
    }

    revalidatePath(`/${productId}`);
  };
};

export type DeleteFeatureRequest = ReturnType<
  typeof createDeleteFeatureRequest
>;
