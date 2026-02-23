import { productWatchers } from "@repo/db";
import { productIdSchema } from "@repo/schema";
import { type ProductSummary } from "@repo/type";
import { getAnonymousIdentifierFromHeaders } from "@repo/user-cookie";
import { summarizeReactions } from "@repo/util/reactions";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  byId: publicProcedure.input(productIdSchema).query(async ({ ctx, input }) => {
    const product = await ctx.db.query.products.findFirst({
      columns: {
        description: true,
        homePageUrl: true,
        id: true,
        logoUrl: true,
        name: true,
      },
      where: (product, { eq }) => eq(product.id, input.id),
      with: {
        featureRequests: {
          columns: {
            content: true,
            createdAt: true,
            id: true,
            status: true,
            title: true,
            updatedAt: true,
          },
          orderBy: (feature, { desc }) => desc(feature.createdAt),
          with: {
            adminComment: {
              columns: {
                content: true,
                updatedAt: true,
              },
              with: {
                adminUser: {
                  columns: {
                    id: true,
                    image: true,
                    name: true,
                  },
                },
              },
            },
            reactions: {
              orderBy: (reaction, { asc }) => asc(reaction.id),
              with: {
                user: {
                  columns: {
                    id: true,
                    image: true,
                    name: true,
                  },
                },
              },
            },
            user: {
              columns: {
                id: true,
                image: true,
                name: true,
              },
            },
          },
        },
        user: {
          columns: {
            image: true,
            name: true,
          },
        },
      },
    });
    if (!product) {
      return null;
    }

    const viewerUserId = ctx.session?.user?.id ?? null;
    const viewerAnonymousIdentifier = viewerUserId
      ? null
      : getAnonymousIdentifierFromHeaders(ctx.headers);
    const watchedProduct = viewerUserId
      ? await ctx.db.query.productWatchers.findFirst({
          columns: {
            productId: true,
          },
          where: (watcher, { and, eq }) =>
            and(
              eq(watcher.productId, product.id),
              eq(watcher.userId, viewerUserId),
            ),
        })
      : null;

    return {
      ...product,
      featureRequests: product.featureRequests.map((feature) => {
        const { adminComment, reactions, ...rest } = feature;
        return {
          adminComment: adminComment ? "管理者からコメントあり" : null,
          adminCommentDetail: adminComment
            ? {
                adminUser: adminComment.adminUser ?? null,
                content: adminComment.content,
                updatedAt: adminComment.updatedAt ?? null,
              }
            : null,
          ...rest,
          reactionSummaries: summarizeReactions(reactions, {
            viewerAnonymousIdentifier,
            viewerUserId,
          }),
        };
      }),
      viewerIsWatching: Boolean(watchedProduct),
    };
  }),

  list: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.query.products.findMany({
      columns: {
        id: true,
        logoUrl: true,
        name: true,
      },
      orderBy: (product, { desc }) => desc(product.createdAt),
      with: {
        featureRequests: {
          columns: {
            id: true,
          },
          with: {
            reactions: {
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    return products.map((product) => {
      const featureCount = product.featureRequests?.length ?? 0;
      const reactionCount =
        product.featureRequests?.reduce(
          (total, feature) => total + (feature.reactions?.length ?? 0),
          0,
        ) ?? 0;

      return {
        featureCount,
        id: product.id,
        logoUrl: product.logoUrl,
        name: product.name,
        reactionCount,
      } satisfies ProductSummary;
    });
  }),

  unwatch: protectedProcedure
    .input(productIdSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(productWatchers)
        .where(
          and(
            eq(productWatchers.productId, input.id),
            eq(productWatchers.userId, ctx.session.user.id),
          ),
        );

      return { id: input.id };
    }),

  watch: protectedProcedure
    .input(productIdSchema)
    .mutation(async ({ ctx, input }) => {
      const currentUser = await ctx.db.query.users.findFirst({
        columns: {
          webhookUrl: true,
        },
        where: (user, { eq }) => eq(user.id, ctx.session.user.id),
      });

      if (!currentUser?.webhookUrl?.trim()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "WEBHOOK_REQUIRED",
        });
      }

      const product = await ctx.db.query.products.findFirst({
        columns: { id: true },
        where: (product, { eq }) => eq(product.id, input.id),
      });

      if (!product) {
        return null;
      }

      await ctx.db
        .insert(productWatchers)
        .values({
          productId: product.id,
          userId: ctx.session.user.id,
        })
        .onConflictDoNothing();

      return { id: product.id };
    }),
});
