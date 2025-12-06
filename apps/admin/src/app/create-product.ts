import { createProductSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";

import { api } from "~/trpc/server";

export const createProduct = async (formData: FormData) => {
  "use server";

  const name = formData.get("name");
  const parsed = safeParse(createProductSchema, { name });
  if (!parsed.success) {
    return;
  }

  const product = await api.product.create(parsed.output);

  if (!product) {
    throw new Error("Product creation returned no result");
  }

  revalidatePath("/");
  redirect(`/products/${product.id}`);
};

export type CreateProduct = typeof createProduct;
