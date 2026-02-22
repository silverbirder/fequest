import {
  accounts,
  featureRequestReactions,
  featureRequests,
  sessions,
  users,
} from "@repo/db";
import { avatarImageUrlSchema, webhookUrlSchema } from "@repo/schema";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const settingRouter = createTRPCRouter({
  current: protectedProcedure.query(async ({ ctx }) => {
    const currentUser = await ctx.db.query.users.findFirst({
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
        .update(users)
        .set({ image: nextImage })
        .where(eq(users.id, ctx.session.user.id));

      return { image: nextImage };
    }),
  updateWebhookUrl: protectedProcedure
    .input(webhookUrlSchema)
    .mutation(async ({ ctx, input }) => {
      const trimmed = input.trim();
      const nextWebhookUrl = trimmed.length > 0 ? trimmed : null;

      await ctx.db
        .update(users)
        .set({ webhookUrl: nextWebhookUrl })
        .where(eq(users.id, ctx.session.user.id));

      return { webhookUrl: nextWebhookUrl };
    }),
  withdraw: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.db.transaction(async (tx) => {
      await tx
        .delete(featureRequestReactions)
        .where(eq(featureRequestReactions.userId, userId));

      await tx
        .delete(featureRequests)
        .where(eq(featureRequests.userId, userId));

      await tx.delete(accounts).where(eq(accounts.userId, userId));
      await tx.delete(sessions).where(eq(sessions.userId, userId));
      await tx.delete(users).where(eq(users.id, userId));
    });

    return { id: userId };
  }),
});
