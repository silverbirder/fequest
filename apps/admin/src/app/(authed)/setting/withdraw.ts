import {
  adminAccounts,
  adminSessions,
  adminUsers,
  featureRequests,
  products,
} from "@repo/db";
import { eq, inArray } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth, signOut } from "~/server/auth";
import { db } from "~/server/db";

export const createWithdraw = () => {
  return async () => {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/sign-in");
      return;
    }

    const userId = session.user.id;

    await db.transaction(async (tx) => {
      const ownedProducts = await tx.query.products.findMany({
        columns: { id: true },
        where: (product, { eq }) => eq(product.userId, userId),
      });
      const ownedProductIds = ownedProducts.map((product) => product.id);

      if (ownedProductIds.length > 0) {
        await tx
          .delete(featureRequests)
          .where(inArray(featureRequests.productId, ownedProductIds));
      }

      await tx.delete(products).where(eq(products.userId, userId));
      await tx.delete(adminAccounts).where(eq(adminAccounts.userId, userId));
      await tx.delete(adminSessions).where(eq(adminSessions.userId, userId));
      await tx.delete(adminUsers).where(eq(adminUsers.id, userId));
    });

    await signOut({ redirectTo: "/sign-in" });
  };
};

export type WithdrawAction = ReturnType<typeof createWithdraw>;
