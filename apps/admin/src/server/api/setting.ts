import {
  adminAccounts,
  adminSessions,
  adminUsers,
  featureRequests,
  products,
} from "@repo/db";
import { avatarImageUrlSchema } from "@repo/schema";
import { eq, inArray } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const settingRouter = createTRPCRouter({
  updateAvatar: protectedProcedure
    .input(avatarImageUrlSchema)
    .mutation(async ({ ctx, input }) => {
      const trimmed = input.trim();
      const nextImage = trimmed.length > 0 ? trimmed : null;

      await ctx.db
        .update(adminUsers)
        .set({ image: nextImage })
        .where(eq(adminUsers.id, ctx.session.user.id));

      return { image: nextImage };
    }),
  withdraw: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.db.transaction(async (tx) => {
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

    return { id: userId };
  }),
});
