import {
  adminAccounts,
  adminSessions,
  adminUsers,
  featureRequests,
  products,
} from "@repo/db";
import { avatarImageUrlSchema, webhookUrlSchema } from "@repo/schema";
import { eq, inArray } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const settingRouter = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.query.adminUsers.findFirst({
      columns: {
        webhookUrl: true,
      },
      where: (user, { eq }) => eq(user.id, ctx.session.user.id),
    });

    return {
      webhookUrl: currentUser?.webhookUrl ?? null,
    };
  }),
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
  updateWebhookUrl: protectedProcedure
    .input(webhookUrlSchema)
    .mutation(async ({ ctx, input }) => {
      const trimmed = input.trim();
      const nextWebhookUrl = trimmed.length > 0 ? trimmed : null;

      await ctx.db
        .update(adminUsers)
        .set({ webhookUrl: nextWebhookUrl })
        .where(eq(adminUsers.id, ctx.session.user.id));

      return { webhookUrl: nextWebhookUrl };
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
