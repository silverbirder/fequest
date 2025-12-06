import { deleteProductSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";

import { api } from "~/trpc/server";

type DeleteProductOptions = {
  productId: number;
};

export const createDeleteProduct = ({ productId }: DeleteProductOptions) => {
  return async (formData: FormData) => {
    "use server";

    const targetId = Number(formData.get("productId"));
    const parsed = safeParse(deleteProductSchema, { id: targetId });
    if (!parsed.success || parsed.output.id !== productId) {
      return;
    }

    try {
      await api.product.delete(parsed.output);
    } catch (error) {
      console.error("Failed to delete product", error);
      return;
    }

    revalidatePath("/");
    redirect("/");
  };
};

export type DeleteProduct = ReturnType<typeof createDeleteProduct>;
