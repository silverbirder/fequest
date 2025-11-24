import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

type DeleteProductOptions = {
  productId: number;
};

export const createDeleteProduct = ({ productId }: DeleteProductOptions) => {
  return async (formData: FormData) => {
    "use server";

    const targetId = Number(formData.get("productId"));
    if (Number.isNaN(targetId) || targetId !== productId) {
      return;
    }

    try {
      await api.product.delete({ id: targetId });
    } catch (error) {
      console.error("Failed to delete product", error);
      return;
    }

    revalidatePath("/");
    redirect("/");
  };
};

export type DeleteProduct = ReturnType<typeof createDeleteProduct>;
