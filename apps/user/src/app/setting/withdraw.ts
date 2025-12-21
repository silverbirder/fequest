import {
  accounts,
  featureRequestReactions,
  featureRequests,
  sessions,
  users,
} from "@repo/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { auth, signOut } from "~/server/auth";
import { db } from "~/server/db";

export const createWithdraw = () => {
  return async () => {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/");
      return;
    }

    const userId = session.user.id;

    await db.transaction(async (tx) => {
      await tx
        .delete(featureRequestReactions)
        .where(eq(featureRequestReactions.userId, userId));

      await tx
        .delete(featureRequests)
        .where(eq(featureRequests.userId, userId));

      await tx.delete(accounts).where(eq(accounts.userId, userId));
      await tx.delete(sessions).where(eq(sessions.userId, userId));
      await tx.delete(users).where(eq(users.id, userId));
    });

    await signOut({ redirectTo: "/" });
  };
};

export type WithdrawAction = ReturnType<typeof createWithdraw>;
