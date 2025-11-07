import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const productRouter = createTRPCRouter({
  byId: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
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
