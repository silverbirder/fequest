import { jaMessages } from "@repo/messages";
import { idSchema } from "@repo/schema";
import { Product } from "@repo/user-feature-product";
import { type Metadata } from "next";
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

const appDescription = "機能リクエスト・共有プラットフォーム";

const resolveProduct = async (paramsPromise: PageProps<"/[id]">["params"]) => {
  const resolvedParams = await paramsPromise;
  const parsedParams = safeParse(paramsSchema, resolvedParams);
  if (!parsedParams.success) {
    notFound();
  }

  const product = await api.product.byId({ id: parsedParams.output.id });

  if (!product) {
    notFound();
  }

  return {
    product,
    productId: parsedParams.output.id,
  };
};

const normalizeText = (value: null | string | undefined) => value?.trim() ?? "";

const buildMetadata = (
  product: NonNullable<Awaited<ReturnType<typeof api.product.byId>>>,
): Metadata => {
  const appName = jaMessages.UserFeatureTop.appName;
  const name = normalizeText(product.name);
  const description = normalizeText(product.description) || appDescription;
  const title = name ? `${name} | ${appName}` : appName;

  return {
    description,
    openGraph: {
      description,
      images: [{ url: `/${product.id}/opengraph-image` }],
      title,
    },
    title,
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[id]">): Promise<Metadata> {
  const { product } = await resolveProduct(params);
  return buildMetadata(product);
}

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[id]">) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const [{ product, productId }, session] = await Promise.all([
    resolveProduct(Promise.resolve(resolvedParams)),
    auth(),
  ]);

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
