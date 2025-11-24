import { Product } from "@repo/admin-feature-product";
import { idSchema } from "@repo/schema";
import { notFound, redirect } from "next/navigation";
import { object, safeParse } from "valibot";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

import { createDeleteProduct } from "./delete-product";
import { createRenameProduct } from "./rename-product";
import { createUpdateFeatureStatus } from "./update-feature-status";

const paramsSchema = object({
  id: idSchema,
});

export default async function Page({ params }: PageProps<"/products/[id]">) {
  const session = await auth();
  if (!session) {
    redirect("/sign-in");
  }

  const parsedParams = safeParse(paramsSchema, await params);
  if (!parsedParams.success) {
    notFound();
  }
  const productId = parsedParams.output.id;

  const product = await api.product.byId({ id: productId });
  if (!product) {
    notFound();
  }

  const deleteProduct = createDeleteProduct({ productId });
  const renameProduct = createRenameProduct({ productId });
  const updateFeatureStatus = createUpdateFeatureStatus({ productId });

  return (
    <Product
      onDelete={deleteProduct}
      onUpdateFeatureStatus={updateFeatureStatus}
      onUpdateName={renameProduct}
      product={product}
    />
  );
}
