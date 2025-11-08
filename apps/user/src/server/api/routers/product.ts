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
          featureRequests: true,
        },
      });
      return product ?? null;
    }),
});
