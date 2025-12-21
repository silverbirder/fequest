import { redirect } from "next/navigation";

import { auth, signOut } from "~/server/auth";
import { api } from "~/trpc/server";

export const createWithdraw = () => {
  return async () => {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/");
      return;
    }

    try {
      await api.setting.withdraw();
    } catch (error) {
      console.error("Failed to withdraw user", error);
      return;
    }

    await signOut({ redirectTo: "/" });
  };
};

export type WithdrawAction = ReturnType<typeof createWithdraw>;
