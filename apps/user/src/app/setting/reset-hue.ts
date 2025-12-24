import { clearHueBaseCookie } from "@repo/user-cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export const createResetHueBase = () => {
  return async () => {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/");
      return;
    }

    const cookieStore = await cookies();
    clearHueBaseCookie(cookieStore);

    redirect("/setting");
  };
};

export type ResetHueBaseAction = ReturnType<typeof createResetHueBase>;
