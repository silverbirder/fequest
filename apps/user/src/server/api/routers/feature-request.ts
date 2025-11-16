import { featureRequestReactions, featureRequests } from "@repo/db";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull, sql } from "drizzle-orm";
import {
  integer,
  maxLength,
  minLength,
  minValue,
  number,
  object,
  optional,
  pipe,
  string,
  transform,
} from "valibot";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const featureRequestsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      object({
        content: pipe(
          string(),
          transform((value) => value.trim()),
          minLength(1),
          maxLength(2000),
        ),
        productId: pipe(number(), integer(), minValue(1)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        columns: { id: true },
        where: (product, { eq }) => eq(product.id, input.productId),
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [featureRequest] = await ctx.db
        .insert(featureRequests)
        .values({
          content: input.content,
          productId: product.id,
          userId: ctx.session.user.id,
        })
        .returning({
          content: featureRequests.content,
          id: featureRequests.id,
          status: featureRequests.status,
        });

      return featureRequest;
    }),
  react: publicProcedure
    .input(
      object({
        action: pipe(string(), minLength(2), maxLength(8)),
        anonymousIdentifier: optional(
          pipe(string(), minLength(1), maxLength(255)),
        ),
        emoji: pipe(string(), minLength(1), maxLength(32)),
        id: pipe(number(), integer(), minValue(1)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const action =
        input.action === "down" ? "down" : input.action === "up" ? "up" : null;

      if (!action) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "action must be either 'up' or 'down'",
        });
      }

      const featureRequest = await ctx.db.query.featureRequests.findFirst({
        columns: { id: true },
        where: (fr, { eq }) => eq(fr.id, input.id),
      });

      if (!featureRequest) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const userId = ctx.session?.user?.id ?? null;
      const anonymousIdentifier = userId
        ? null
        : (input.anonymousIdentifier ?? null);

      if (!userId && !anonymousIdentifier) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "anonymousIdentifier is required for anonymous reactions",
        });
      }

      const identityCondition = userId
        ? eq(featureRequestReactions.userId, userId)
        : and(
            isNull(featureRequestReactions.userId),
            eq(
              featureRequestReactions.anonymousIdentifier,
              anonymousIdentifier!,
            ),
          );

      if (action === "down") {
        await ctx.db
          .delete(featureRequestReactions)
          .where(
            and(
              eq(featureRequestReactions.featureRequestId, featureRequest.id),
              eq(featureRequestReactions.emoji, input.emoji),
              identityCondition,
            ),
          );
      } else {
        await ctx.db
          .insert(featureRequestReactions)
          .values({
            anonymousIdentifier,
            emoji: input.emoji,
            featureRequestId: featureRequest.id,
            userId,
          })
          .onConflictDoNothing();
      }

      const reactionCounts = await ctx.db
        .select({
          count: sql<number>`count(*)`,
          emoji: featureRequestReactions.emoji,
        })
        .from(featureRequestReactions)
        .where(eq(featureRequestReactions.featureRequestId, featureRequest.id))
        .groupBy(featureRequestReactions.emoji);

      return {
        action,
        counts: reactionCounts,
        featureRequestId: featureRequest.id,
      };
    }),
});
