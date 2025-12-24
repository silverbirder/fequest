import { parseHueBase, setHueBaseCookie } from "@repo/user-cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export const createUpdateHueBase = () => {
  return async (formData: FormData) => {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/");
      return;
    }

    const hueBaseValue = formData.get("hueBase");
    const parsed = parseHueBase(
      typeof hueBaseValue === "string" ? hueBaseValue : null,
    );

    if (parsed === null) {
      throw new Error("Invalid hue base value");
    }

    const cookieStore = await cookies();
    setHueBaseCookie(cookieStore, parsed);

    redirect("/setting");
  };
};

export type UpdateHueBaseAction = ReturnType<typeof createUpdateHueBase>;
