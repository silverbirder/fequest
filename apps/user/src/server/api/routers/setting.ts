import {
  accounts,
  featureRequestReactions,
  featureRequests,
  sessions,
  users,
} from "@repo/db";
import { avatarImageUrlSchema } from "@repo/schema";
import { eq } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const settingRouter = createTRPCRouter({
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
