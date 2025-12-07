import { Top } from "@repo/user-feature-top";

import { api } from "~/trpc/server";

export default async function Home() {
  const products = await api.product.list();

  return <Top products={products} />;
}
