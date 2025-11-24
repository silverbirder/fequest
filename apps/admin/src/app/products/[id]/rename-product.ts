import { revalidatePath } from "next/cache";

import { api } from "~/trpc/server";

type RenameProductOptions = {
  productId: number;
};

export const createRenameProduct = ({ productId }: RenameProductOptions) => {
  return async (formData: FormData) => {
    "use server";

    const targetId = Number(formData.get("productId"));
    const name = formData.get("name");

    if (
      Number.isNaN(targetId) ||
      targetId !== productId ||
      typeof name !== "string"
    ) {
      return;
    }

    const trimmed = name.trim();
    if (trimmed.length === 0) {
      return;
    }

    try {
      await api.product.rename({ id: targetId, name: trimmed });
    } catch (error) {
      console.error("Failed to rename product", error);
    }

    revalidatePath(`/products/${productId}`);
  };
};

export type RenameProduct = ReturnType<typeof createRenameProduct>;
