import { Products } from "@repo/user-feature-products";

import { api } from "~/trpc/server";

export default async function Home() {
  const products = await api.product.list();

  return <Products products={products} />;
}
