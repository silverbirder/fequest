import { Top } from "@repo/user-feature-top";

import { env } from "~/env";
import { api } from "~/trpc/server";

export default async function Home() {
  const products = await api.product.list();

  return <Top adminDomain={env.ADMIN_DOMAIN_URL} products={products} />;
}
