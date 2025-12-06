import { featureRequestTitleSchema, positiveIntSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";

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
    const parsedProductId = safeParse(positiveIntSchema, productId);
    const parsedTitle = safeParse(featureRequestTitleSchema, title);

    if (!parsedProductId.success || !parsedTitle.success) {
      return;
    }

    let createdId: null | number = null;

    try {
      const featureRequest = await api.featureRequests.create({
        productId: parsedProductId.output,
        title: parsedTitle.output,
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
