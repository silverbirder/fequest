import { posts } from "@repo/db";
import { minLength, object, pipe, string } from "valibot";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: protectedProcedure
    .input(object({ name: pipe(string(), minLength(1)) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        createdById: ctx.session.user.id,
        name: input.name,
      });
    }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  hello: publicProcedure
    .input(object({ text: string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
});
