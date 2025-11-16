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

    const title = formData.get("title");
    if (typeof title !== "string") {
      return;
    }

    const trimmed = title.trim();
    if (trimmed.length === 0) {
      return;
    }

    try {
      await api.featureRequests.create({
        productId,
        title: trimmed,
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
