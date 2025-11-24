import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type UpdateFeatureStatusOptions = {
  productId: number;
};

const isFeatureStatus = (value: unknown): value is "closed" | "open" =>
  value === "open" || value === "closed";

export const createUpdateFeatureStatus = ({
  productId,
}: UpdateFeatureStatusOptions) => {
  return async (formData: FormData) => {
    "use server";

    const featureId = Number(formData.get("featureId"));
    const status = formData.get("status");

    if (Number.isNaN(featureId) || !isFeatureStatus(status)) {
      return;
    }

    try {
      await api.product.setFeatureStatus({ featureId, status });
    } catch (error) {
      console.error("Failed to update feature status", error);
    }

    revalidatePath(`/products/${productId}`);
  };
};

export type UpdateFeatureStatus = ReturnType<typeof createUpdateFeatureStatus>;
