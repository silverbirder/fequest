import { jaMessages } from "@repo/messages";
import { Top } from "@repo/user-feature-top";
import { type Metadata } from "next";

import { env } from "~/env";
import { api } from "~/trpc/server";

const { appName, hero } = jaMessages.UserFeatureTop;

export const metadata: Metadata = {
  description: hero.tagline,
  openGraph: {
    description: hero.tagline,
    title: appName,
  },
  title: appName,
};

export default async function Home() {
  const products = await api.product.list();

  return <Top adminDomain={env.ADMIN_DOMAIN_URL} products={products} />;
}
