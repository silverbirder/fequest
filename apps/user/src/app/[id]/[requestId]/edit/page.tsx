import { jaMessages } from "@repo/messages";
import { idSchema } from "@repo/schema";
import { RequestEdit } from "@repo/user-feature-request-edit";
import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { object, safeParse } from "valibot";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

import { createUpdateFeatureRequest } from "./create-update-feature-request";
import { createDeleteFeatureRequest } from "./delete-feature-request";

const paramsSchema = object({
  id: idSchema,
  requestId: idSchema,
});

const appName = jaMessages.UserFeatureTop.appName;
const editTitle = jaMessages.UserFeatureRequestEdit.title;

const normalizeText = (value: null | string | undefined) => value?.trim() ?? "";

const buildEditDescription = (productName: string, requestTitle?: string) => {
  const name = normalizeText(productName) || appName;
  const title = normalizeText(requestTitle);
  if (!title) {
    return `${name} へのリクエストを更新します。`;
  }

  return jaMessages.UserFeatureRequestEdit.description
    .replace("{productName}", name)
    .replace("{requestTitle}", title);
};

const resolveFeatureRequest = async (
  paramsPromise: PageProps<"/[id]/[requestId]/edit">["params"],
) => {
  const resolvedParams = await paramsPromise;
  const parsedParams = safeParse(paramsSchema, resolvedParams);

  if (!parsedParams.success) {
    notFound();
  }

  const { id: productId, requestId } = parsedParams.output;
  const featureRequest = await api.featureRequests.byId({
    id: requestId,
    productId,
  });

  if (!featureRequest) {
    notFound();
  }

  return { featureRequest, productId };
};

export async function generateMetadata({
  params,
}: PageProps<"/[id]/[requestId]/edit">): Promise<Metadata> {
  const { featureRequest } = await resolveFeatureRequest(params);
  const productName = featureRequest.product?.name ?? "";
  const description = buildEditDescription(productName, featureRequest.title);

  return {
    description,
    openGraph: {
      description,
      title: `${editTitle} | ${appName}`,
    },
    title: `${editTitle} | ${appName}`,
  };
}

export default async function Page({
  params,
}: PageProps<"/[id]/[requestId]/edit">) {
  const resolvedParams = await params;
  const [{ featureRequest, productId }, session] = await Promise.all([
    resolveFeatureRequest(Promise.resolve(resolvedParams)),
    auth(),
  ]);

  if (!session?.user || featureRequest.user?.id !== session.user.id) {
    notFound();
  }

  const updateFeatureRequest = createUpdateFeatureRequest({ productId });
  const deleteFeatureRequest = createDeleteFeatureRequest({ productId });

  return (
    <RequestEdit
      backHref={{
        pathname: `/${productId}`,
        query: { open: featureRequest.id },
      }}
      defaultValues={{
        content: featureRequest.content ?? "",
        title: featureRequest.title ?? "",
      }}
      featureId={featureRequest.id}
      onDelete={deleteFeatureRequest}
      onSubmit={updateFeatureRequest}
      productName={featureRequest.product?.name ?? ""}
      requestTitle={featureRequest.title ?? undefined}
    />
  );
}
