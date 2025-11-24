import { Dashboard } from "@repo/admin-feature-dashboard";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

import { createProduct } from "./create-product";

export default async function Page() {
  const session = await auth();
  const products = session?.user ? await api.product.list() : [];

  return <Dashboard onCreateProduct={createProduct} products={products} />;
}
