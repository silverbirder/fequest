import { renameProductSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { safeParse } from "valibot";

import { api } from "~/trpc/server";

type RenameProductOptions = {
  productId: number;
};

export const createRenameProduct = ({ productId }: RenameProductOptions) => {
  return async (formData: FormData) => {
    "use server";

    const targetId = Number(formData.get("productId"));
    const name = formData.get("name");

    const parsed = safeParse(renameProductSchema, { id: targetId, name });
    if (!parsed.success || parsed.output.id !== productId) {
      return;
    }

    try {
      await api.product.rename(parsed.output);
    } catch (error) {
      console.error("Failed to rename product", error);
    }

    revalidatePath(`/products/${productId}`);
  };
};

export type RenameProduct = ReturnType<typeof createRenameProduct>;
