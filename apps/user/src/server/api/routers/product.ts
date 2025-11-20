import { getAnonymousIdentifierFromHeaders } from "@repo/user-cookie";
import { summarizeReactions } from "@repo/user-feature-product";
import { integer, minValue, number, object, pipe } from "valibot";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  byId: publicProcedure
    .input(
      object({
        id: pipe(number(), integer(), minValue(1)),
      }),
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        where: (product, { eq }) => eq(product.id, input.id),
        with: {
          featureRequests: {
            with: {
              reactions: {
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
});
