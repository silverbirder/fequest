import { updateProductDetailsSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { safeParse } from "valibot";

import { api } from "~/trpc/server";

type UpdateProductDetailsOptions = {
  productId: number;
};

export const createUpdateProductDetails = (
  options: UpdateProductDetailsOptions,
) => {
  const { productId } = options;

  return async (formData: FormData) => {
    "use server";

    const targetId = Number(formData.get("productId"));
    const logoUrl = formData.get("logoUrl");
    const homePageUrl = formData.get("homePageUrl");
    const description = formData.get("description");

    const parsed = safeParse(updateProductDetailsSchema, {
      description: typeof description === "string" ? description : undefined,
      homePageUrl: typeof homePageUrl === "string" ? homePageUrl : undefined,
      id: targetId,
      logoUrl: typeof logoUrl === "string" ? logoUrl : undefined,
    });

    if (!parsed.success || parsed.output.id !== productId) {
      return;
    }

    try {
      await api.product.updateDetails(parsed.output);
    } catch (error) {
      console.error("Failed to update product details", error);
    }

    revalidatePath(`/products/${productId}`);
  };
};

export type UpdateProductDetails = ReturnType<
  typeof createUpdateProductDetails
>;
