import { productIdSchema } from "@repo/schema";
import { type ProductSummary } from "@repo/type";
import { getAnonymousIdentifierFromHeaders } from "@repo/user-cookie";
import { summarizeReactions } from "@repo/util/reactions";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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

    return {
      ...product,
      featureRequests: product.featureRequests.map((feature) => {
        const { reactions, ...rest } = feature;
        return {
          ...rest,
          reactionSummaries: summarizeReactions(reactions, {
            viewerAnonymousIdentifier,
            viewerUserId,
          }),
        };
      }),
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
});
