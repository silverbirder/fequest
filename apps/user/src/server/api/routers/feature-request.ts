import { featureRequestReactions, featureRequests } from "@repo/db";
import {
  createFeatureRequestSchema,
  deleteFeatureRequestSchema,
  featureRequestByProductSchema,
  reactToFeatureRequestSchema,
  updateFeatureRequestSchema,
} from "@repo/schema";
import { notifyWebhook } from "@repo/util/webhook";
import { buildFeatureRequestWebhookPayload } from "@repo/util/webhook-payload";
import { TRPCError } from "@trpc/server";
import { and, eq, isNull, sql } from "drizzle-orm";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const featureRequestsRouter = createTRPCRouter({
  byId: publicProcedure
    .input(featureRequestByProductSchema)
    .query(async ({ ctx, input }) => {
      const featureRequest = await ctx.db.query.featureRequests.findFirst({
        columns: {
          content: true,
          id: true,
          productId: true,
          title: true,
          userId: true,
        },
        where: (fr, { and, eq }) =>
          and(eq(fr.id, input.id), eq(fr.productId, input.productId)),
        with: {
          product: {
            columns: { id: true, name: true },
          },
          user: {
            columns: { id: true, image: true, name: true },
          },
        },
      });

      return featureRequest ?? null;
    }),
  create: protectedProcedure
    .input(createFeatureRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.query.products.findFirst({
        columns: { id: true, name: true },
        where: (product, { eq }) => eq(product.id, input.productId),
        with: {
          user: {
            columns: {
              webhookUrl: true,
            },
          },
          watchers: {
            columns: {
              userId: true,
            },
            with: {
              user: {
                columns: {
                  webhookUrl: true,
                },
              },
            },
          },
        },
      });

      if (!product) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [featureRequest] = await ctx.db
        .insert(featureRequests)
        .values({
          content: "",
          productId: product.id,
          title: input.title,
          userId: ctx.session.user.id,
        })
        .returning({
          content: featureRequests.content,
          id: featureRequests.id,
          status: featureRequests.status,
          title: featureRequests.title,
        });

      const payload = buildFeatureRequestWebhookPayload({
        event: "created",
        productName: product.name,
        requestTitle: input.title,
      });
      const watcherTargets = (product.watchers ?? [])
        .map((watcher) => watcher.user?.webhookUrl)
        .filter((webhookUrl): webhookUrl is string =>
          Boolean(webhookUrl?.trim()),
        );

      await Promise.all([
        notifyWebhook({
          payload,
          webhookUrl: product.user?.webhookUrl,
        }),
        ...watcherTargets.map((webhookUrl) =>
          notifyWebhook({
            payload,
            webhookUrl,
          }),
        ),
      ]);

      return featureRequest;
    }),
  delete: protectedProcedure
    .input(deleteFeatureRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const featureRequest = await ctx.db.query.featureRequests.findFirst({
        columns: { id: true, productId: true, title: true, userId: true },
        where: (fr, { eq }) => eq(fr.id, input.id),
        with: {
          product: {
            columns: {
              name: true,
            },
            with: {
              user: {
                columns: {
                  webhookUrl: true,
                },
              },
            },
          },
        },
      });

      if (!featureRequest) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (featureRequest.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await ctx.db
        .delete(featureRequests)
        .where(eq(featureRequests.id, featureRequest.id));

      const watcherRows = await ctx.db.query.productWatchers.findMany({
        columns: {
          userId: true,
        },
        where: (watcher, { eq }) =>
          eq(watcher.productId, featureRequest.productId),
        with: {
          user: {
            columns: {
              webhookUrl: true,
            },
          },
        },
      });

      const watcherTargets = watcherRows
        .map((watcher) => watcher.user?.webhookUrl)
        .filter((webhookUrl): webhookUrl is string =>
          Boolean(webhookUrl?.trim()),
        );
      const payload = buildFeatureRequestWebhookPayload({
        event: "deleted",
        productName: featureRequest.product?.name ?? "Product",
        requestTitle: featureRequest.title,
      });

      await Promise.all([
        notifyWebhook({
          payload,
          webhookUrl: featureRequest.product?.user?.webhookUrl,
        }),
        ...watcherTargets.map((webhookUrl) =>
          notifyWebhook({
            payload,
            webhookUrl,
          }),
        ),
      ]);

      return { id: featureRequest.id };
    }),
  react: publicProcedure
    .input(reactToFeatureRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const action = input.action;

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
  update: protectedProcedure
    .input(updateFeatureRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const featureRequest = await ctx.db.query.featureRequests.findFirst({
        columns: { id: true, productId: true, userId: true },
        where: (fr, { eq }) => eq(fr.id, input.id),
        with: {
          product: {
            columns: {
              name: true,
            },
            with: {
              user: {
                columns: {
                  webhookUrl: true,
                },
              },
            },
          },
        },
      });

      if (!featureRequest) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (featureRequest.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const [updated] = await ctx.db
        .update(featureRequests)
        .set({ content: input.content, title: input.title })
        .where(eq(featureRequests.id, input.id))
        .returning({
          content: featureRequests.content,
          id: featureRequests.id,
          title: featureRequests.title,
          updatedAt: featureRequests.updatedAt,
        });

      const watcherRows = await ctx.db.query.productWatchers.findMany({
        columns: {
          userId: true,
        },
        where: (watcher, { eq }) =>
          eq(watcher.productId, featureRequest.productId),
        with: {
          user: {
            columns: {
              webhookUrl: true,
            },
          },
        },
      });

      const watcherTargets = watcherRows
        .map((watcher) => watcher.user?.webhookUrl)
        .filter((webhookUrl): webhookUrl is string =>
          Boolean(webhookUrl?.trim()),
        );
      const payload = buildFeatureRequestWebhookPayload({
        event: "updated",
        productName: featureRequest.product?.name ?? "Product",
        requestTitle: input.title,
      });

      await Promise.all([
        notifyWebhook({
          payload,
          webhookUrl: featureRequest.product?.user?.webhookUrl,
        }),
        ...watcherTargets.map((webhookUrl) =>
          notifyWebhook({
            payload,
            webhookUrl,
          }),
        ),
      ]);

      return updated ?? null;
    }),
});
