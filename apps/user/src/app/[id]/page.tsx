import { revalidatePath } from "next/cache";

import { Product } from "@repo/user-feature-product";
import { idSchema } from "@repo/schema";
import { api } from "~/trpc/server";
import { object, safeParse } from "valibot";

const paramsSchema = object({
  id: idSchema,
});

export default async function Page({ params }: PageProps<"/[id]">) {
  const parsedParams = safeParse(paramsSchema, await params);
  if (!parsedParams.success) {
    return <div>Invalid product ID</div>;
  }
  const productId = parsedParams.output.id;

  const likeFeature = async (formData: FormData) => {
    "use server";

    const featureId = Number(formData.get("featureId"));
    if (!Number.isInteger(featureId) || featureId <= 0) {
      return;
    }

    try {
      await api.featureRequests.like({ id: featureId });
    } catch (error) {
      console.error("Failed to like feature request", error);
    }

    revalidatePath(`/${productId}`);
  };

  const product = await api.product.byId({ id: productId });

  if (!product) {
    return <div>Product not found</div>;
  }

  return <Product product={product} onLikeFeature={likeFeature} />;
}
