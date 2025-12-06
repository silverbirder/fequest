import { updateFeatureRequestSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { safeParse } from "valibot";

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

    const parsedInput = safeParse(updateFeatureRequestSchema, {
      content,
      id: featureId,
    });

    if (!parsedInput.success) {
      return;
    }

    try {
      await api.featureRequests.update({
        content: parsedInput.output.content,
        id: parsedInput.output.id,
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
