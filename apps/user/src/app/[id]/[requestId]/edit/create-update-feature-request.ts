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
    const title = formData.get("title");

    const parsedInput = safeParse(updateFeatureRequestSchema, {
      content,
      id: featureId,
      title,
    });

    if (!parsedInput.success) {
      return;
    }

    let updated = false;

    try {
      await api.featureRequests.update({
        content: parsedInput.output.content,
        id: parsedInput.output.id,
        title: parsedInput.output.title,
      });
      updated = true;
    } catch (error) {
      console.error("Failed to update feature request", error);
    }

    revalidatePath(`/${productId}`);

    if (updated) {
      return;
    }
  };
};

export type UpdateFeatureRequest = ReturnType<
  typeof createUpdateFeatureRequest
>;
