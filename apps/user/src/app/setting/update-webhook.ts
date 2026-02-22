import { webhookUrlSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export const createUpdateWebhookUrl = () => {
  return async (formData: FormData) => {
    "use server";

    const session = await auth();

    if (!session?.user) {
      redirect("/");
      return;
    }

    const webhookUrl = formData.get("webhookUrl");
    const parsed = safeParse(
      webhookUrlSchema,
      typeof webhookUrl === "string" ? webhookUrl : "",
    );

    if (!parsed.success) {
      return;
    }

    try {
      await api.setting.updateWebhookUrl(parsed.output);
    } catch (error) {
      console.error("Failed to update webhook url", error);
      return;
    }

    revalidatePath("/setting");
  };
};

export type UpdateWebhookUrlAction = ReturnType<typeof createUpdateWebhookUrl>;
