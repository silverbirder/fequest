import { idSchema } from "@repo/schema";
import { Product } from "@repo/user-feature-product";
import { notFound } from "next/navigation";
import { object, safeParse } from "valibot";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

import { createCreateFeatureRequest } from "./create-feature-request";
import { getOpenFeatureRequestId } from "./get-open-feature-request-id";
import { createReactToFeature } from "./react-to-feature";

const paramsSchema = object({
  id: idSchema,
});

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[id]">) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const parsedParams = safeParse(paramsSchema, resolvedParams);
  if (!parsedParams.success) {
    notFound();
  }
  const productId = parsedParams.output.id;
  const [product, session] = await Promise.all([
    api.product.byId({ id: productId }),
    auth(),
  ]);

  if (!product) {
    notFound();
  }

  const createFeatureRequest = createCreateFeatureRequest({ productId });
  const reactToFeature = createReactToFeature({ productId });

  const canCreateFeatureRequest = Boolean(session?.user);
  const openFeatureRequestId = getOpenFeatureRequestId(resolvedSearchParams);
  const currentUser = session?.user
    ? {
        id: session.user.id,
        image: session.user.image ?? null,
        name: session.user.name ?? null,
      }
    : null;

  return (
    <Product
      canCreateFeatureRequest={canCreateFeatureRequest}
      currentUser={currentUser}
      onCreateFeatureRequest={createFeatureRequest}
      onReactToFeature={reactToFeature}
      openFeatureRequestId={openFeatureRequestId}
      product={product}
    />
  );
}
