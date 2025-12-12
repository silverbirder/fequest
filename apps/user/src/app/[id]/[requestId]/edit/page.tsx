import { idSchema } from "@repo/schema";
import { RequestEdit } from "@repo/user-feature-request-edit";
import { notFound, redirect } from "next/navigation";
import { object, safeParse } from "valibot";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

import { createUpdateFeatureRequest } from "./create-update-feature-request";
import { createDeleteFeatureRequest } from "./delete-feature-request";

const paramsSchema = object({
  id: idSchema,
  requestId: idSchema,
});

export default async function Page({
  params,
}: PageProps<"/[id]/[requestId]/edit">) {
  const resolvedParams = await params;
  const parsedParams = safeParse(paramsSchema, resolvedParams);

  if (!parsedParams.success) {
    notFound();
  }

  const { id: productId, requestId } = parsedParams.output;
  const [session, featureRequest] = await Promise.all([
    auth(),
    api.featureRequests.byId({ id: requestId, productId }),
  ]);

  if (!featureRequest) {
    notFound();
  }

  if (!session?.user || featureRequest.user?.id !== session.user.id) {
    redirect(`/${productId}`);
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
