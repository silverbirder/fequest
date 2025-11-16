import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type CreateFeatureRequestOptions = {
  productId: number;
};

export const createCreateFeatureRequest = ({
  productId,
}: CreateFeatureRequestOptions) => {
  return async (formData: FormData) => {
    "use server";

    const content = formData.get("content");
    if (typeof content !== "string") {
      return;
    }

    const trimmed = content.trim();
    if (trimmed.length === 0) {
      return;
    }

    try {
      await api.featureRequests.create({
        content: trimmed,
        productId,
      });
    } catch (error) {
      console.error("Failed to create feature request", error);
    }

    revalidatePath(`/${productId}`);
  };
};

export type CreateFeatureRequest = ReturnType<
  typeof createCreateFeatureRequest
>;
