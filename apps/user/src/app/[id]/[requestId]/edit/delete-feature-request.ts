import { deleteFeatureRequestSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";

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
    const parsed = safeParse(deleteFeatureRequestSchema, { id: featureId });
    if (!parsed.success) {
      return;
    }

    try {
      await api.featureRequests.delete({ id: parsed.output.id });
    } catch (error) {
      console.error("Failed to delete feature request", error);
    }

    revalidatePath(`/${productId}`);
    redirect(`/${productId}`);
  };
};

export type DeleteFeatureRequest = ReturnType<
  typeof createDeleteFeatureRequest
>;
