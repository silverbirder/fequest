import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

export const createProduct = async (formData: FormData) => {
  "use server";

  const name = formData.get("name");
  if (typeof name !== "string") {
    return;
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return;
  }

  const product = await api.product.create({ name: trimmed });

  if (!product) {
    throw new Error("Product creation returned no result");
  }

  revalidatePath("/");
  redirect(`/products/${product.id}`);
};

export type CreateProduct = typeof createProduct;
