import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { featureRequests } from "@repo/db";

export const featureRequestsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(featureRequests)
        .set({
          likes: sql<number>`${featureRequests.likes} + 1`,
        })
        .where(eq(featureRequests.id, input.id))
        .returning();

      if (!updated) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return updated;
    }),
});
