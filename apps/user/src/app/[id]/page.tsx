import { idSchema } from "@repo/schema";
import { Product } from "@repo/user-feature-product";
import { notFound } from "next/navigation";
import { object, safeParse } from "valibot";

import { api } from "~/trpc/server";

import { createReactToFeature } from "./react-to-feature";

const paramsSchema = object({
  id: idSchema,
});

export default async function Page({ params }: PageProps<"/[id]">) {
  const parsedParams = safeParse(paramsSchema, await params);
  if (!parsedParams.success) {
    notFound();
  }
  const productId = parsedParams.output.id;

  const product = await api.product.byId({ id: productId });

  if (!product) {
    notFound();
  }

  const reactToFeature = createReactToFeature({ productId });

  return <Product onReactToFeature={reactToFeature} product={product} />;
}
