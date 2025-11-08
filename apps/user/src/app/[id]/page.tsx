import { revalidatePath } from "next/cache";

import { Product } from "@repo/user-feature-product";
import { api } from "~/trpc/server";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return <div>Invalid product ID</div>;
  }

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

    revalidatePath(`/${id}`);
  };

  const product = await api.product.byId({ id: productId });

  if (!product) {
    return <div>Product not found</div>;
  }

  return <Product product={product} onLikeFeature={likeFeature} />;
}
