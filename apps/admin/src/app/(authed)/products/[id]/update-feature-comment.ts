import { updateFeatureAdminCommentSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { safeParse } from "valibot";

import { api } from "~/trpc/server";

type UpdateFeatureCommentOptions = {
  productId: number;
};

export const createUpdateFeatureComment = ({
  productId,
}: UpdateFeatureCommentOptions) => {
  return async (formData: FormData) => {
    "use server";

    const featureId = Number(formData.get("featureId"));
    const comment = formData.get("comment");

    const parsed = safeParse(updateFeatureAdminCommentSchema, {
      comment: typeof comment === "string" ? comment : "",
      featureId,
    });
    if (!parsed.success) {
      return;
    }

    try {
      await api.product.updateFeatureComment(parsed.output);
    } catch (error) {
      console.error("Failed to update feature comment", error);
    }

    revalidatePath(`/products/${productId}`);
  };
};

export type UpdateFeatureComment = ReturnType<
  typeof createUpdateFeatureComment
>;
