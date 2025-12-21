import { avatarImageUrlSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export const createUpdateAvatar = () => {
  return async (formData: FormData) => {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/sign-in");
      return;
    }

    const avatarUrl = formData.get("avatarUrl");
    const parsed = safeParse(
      avatarImageUrlSchema,
      typeof avatarUrl === "string" ? avatarUrl : "",
    );

    if (!parsed.success) {
      return;
    }

    try {
      await api.setting.updateAvatar(parsed.output);
    } catch (error) {
      console.error("Failed to update avatar", error);
      return;
    }

    revalidatePath("/setting");
  };
};

export type UpdateAvatarAction = ReturnType<typeof createUpdateAvatar>;
