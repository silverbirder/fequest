import { featureRequests } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { integer, minValue, number, object, pipe } from "valibot";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const featureRequestsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      object({
        id: pipe(number(), integer(), minValue(1)),
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
