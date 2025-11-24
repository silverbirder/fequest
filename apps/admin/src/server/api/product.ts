import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type ProductSummary = {
  featureCount: number;
  id: number;
  name: string;
  reactionCount: number;
};

export const productRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const products = await ctx.db.query.products.findMany({
      orderBy: (product, { desc }) => desc(product.createdAt),
      where: (product, { eq }) => eq(product.userId, userId),
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
        name: product.name,
        reactionCount,
      } satisfies ProductSummary;
    });
  }),
});
