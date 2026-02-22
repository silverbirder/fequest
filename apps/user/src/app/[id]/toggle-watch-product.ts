import { productIdSchema } from "@repo/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { safeParse } from "valibot";

import { api } from "~/trpc/server";

type ToggleWatchProductOptions = {
  productId: number;
};

export const createToggleWatchProduct = ({
  productId,
}: ToggleWatchProductOptions) => {
  return async (formData: FormData) => {
    "use server";

    const target = formData.get("target");
    const parsedProductId = safeParse(productIdSchema, { id: productId });

    if (
      !parsedProductId.success ||
      (target !== "watch" && target !== "unwatch")
    ) {
      return;
    }

    try {
      if (target === "watch") {
        await api.product.watch({ id: parsedProductId.output.id });
      } else {
        await api.product.unwatch({ id: parsedProductId.output.id });
      }
    } catch (error) {
      if (target === "watch" && error instanceof Error) {
        const isWebhookRequired =
          error.message === "WEBHOOK_REQUIRED" ||
          error.message.includes("WEBHOOK_REQUIRED");

        if (isWebhookRequired) {
          redirect("/setting?from=watch");
        }
      }
      console.error("Failed to toggle product watch", error);
      return;
    }

    revalidatePath(`/${productId}`);
  };
};

export type ToggleWatchProduct = ReturnType<typeof createToggleWatchProduct>;
