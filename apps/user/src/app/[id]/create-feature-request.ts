import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

    let createdId: null | number = null;

    try {
      const featureRequest = await api.featureRequests.create({
        productId,
        title: trimmed,
      });
      createdId = featureRequest?.id ?? null;
    } catch (error) {
      console.error("Failed to create feature request", error);
    }

    revalidatePath(`/${productId}`);

    if (createdId) {
      redirect(`/${productId}?open=${createdId}`);
    }
  };
};

export type CreateFeatureRequest = ReturnType<
  typeof createCreateFeatureRequest
>;
