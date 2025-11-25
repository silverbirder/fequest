import {
  featureRequests,
  featureRequestStatuses,
  products,
} from "@repo/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import {
  maxLength,
  minLength,
  number,
  object,
  picklist,
  pipe,
  string,
  trim,
} from "valibot";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type ProductSummary = {
  featureCount: number;
  id: number;
  name: string;
  reactionCount: number;
};

const productIdSchema = object({ id: number() });

const createInputSchema = object({
  name: pipe(string(), trim(), minLength(1), maxLength(256)),
});

const renameInputSchema = object({
  id: number(),
  name: pipe(string(), trim(), minLength(1), maxLength(256)),
});

const setFeatureStatusInputSchema = object({
  featureId: number(),
  status: picklist(featureRequestStatuses),
});

const deleteFeatureRequestInputSchema = object({
  featureId: number(),
});

const deleteInputSchema = object({
  id: number(),
});

export const productRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(productIdSchema)
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        columns: {
          id: true,
          name: true,
        },
        where: (product, { and, eq }) =>
          and(
            eq(product.id, input.id),
            eq(product.userId, ctx.session.user.id),
          ),
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
          },
        },
      });

      if (!product) {
        return null;
      }

      return {
        featureRequests: product.featureRequests ?? [],
        id: product.id,
        name: product.name,
      };
    }),

  create: protectedProcedure
    .input(createInputSchema)
    .mutation(async ({ ctx, input }) => {
      const [product] = await ctx.db
        .insert(products)
        .values({ name: input.name.trim(), userId: ctx.session.user.id })
        .returning({ id: products.id, name: products.name });

      if (!product) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product",
        });
      }

      return product;
    }),

  delete: protectedProcedure
    .input(deleteInputSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        columns: {
          id: true,
        },
        where: (product, { and, eq }) =>
          and(
            eq(product.id, input.id),
            eq(product.userId, ctx.session.user.id),
          ),
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .delete(featureRequests)
          .where(eq(featureRequests.productId, input.id));
        await tx.delete(products).where(eq(products.id, input.id));
      });

      return { id: input.id };
    }),

  deleteFeatureRequest: protectedProcedure
    .input(deleteFeatureRequestInputSchema)
    .mutation(async ({ ctx, input }) => {
      const feature = await ctx.db.query.featureRequests.findFirst({
        columns: { id: true, productId: true },
        where: (feature, { eq }) => eq(feature.id, input.featureId),
        with: {
          product: {
            columns: {
              userId: true,
            },
          },
        },
      });

      if (!feature || feature.product?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feature request not found",
        });
      }

      await ctx.db
        .delete(featureRequests)
        .where(eq(featureRequests.id, input.featureId));

      return { id: feature.id, productId: feature.productId };
    }),

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

  rename: protectedProcedure
    .input(renameInputSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedProducts = await ctx.db
        .update(products)
        .set({ name: input.name.trim() })
        .where(
          and(
            eq(products.id, input.id),
            eq(products.userId, ctx.session.user.id),
          ),
        )
        .returning({ id: products.id, name: products.name });

      if (updatedProducts.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return updatedProducts[0]!;
    }),

  setFeatureStatus: protectedProcedure
    .input(setFeatureStatusInputSchema)
    .mutation(async ({ ctx, input }) => {
      const feature = await ctx.db.query.featureRequests.findFirst({
        columns: {
          id: true,
          productId: true,
          status: true,
        },
        where: (feature, { eq }) => eq(feature.id, input.featureId),
        with: {
          product: {
            columns: {
              userId: true,
            },
          },
        },
      });

      if (!feature || feature.product?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Feature request not found",
        });
      }

      const [updated] = await ctx.db
        .update(featureRequests)
        .set({ status: input.status })
        .where(eq(featureRequests.id, input.featureId))
        .returning({
          id: featureRequests.id,
          productId: featureRequests.productId,
          status: featureRequests.status,
        });

      return updated ?? null;
    }),
});
