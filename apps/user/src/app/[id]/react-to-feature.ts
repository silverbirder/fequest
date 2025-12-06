import {
  reactionAnonymousIdentifierSchema,
  reactToFeatureRequestSchema,
} from "@repo/schema";
import { ensureAnonymousIdentifier } from "@repo/user-cookie";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { safeParse } from "valibot";

import { api } from "~/trpc/server";

type CreateReactToFeatureOptions = {
  productId: number;
};

export const createReactToFeature = ({
  productId,
}: CreateReactToFeatureOptions) => {
  return async (formData: FormData) => {
    "use server";

    const featureId = Number(formData.get("featureId"));
    const emoji = formData.get("emoji");
    const action = formData.get("action");

    const parsedInput = safeParse(reactToFeatureRequestSchema, {
      action,
      emoji,
      id: featureId,
    });

    if (!parsedInput.success) {
      return;
    }

    const cookieStore = await cookies();
    const anonymousIdentifier = ensureAnonymousIdentifier(cookieStore);
    const parsedAnonymous = safeParse(
      reactionAnonymousIdentifierSchema,
      anonymousIdentifier,
    );

    const payload = {
      ...parsedInput.output,
      anonymousIdentifier: parsedAnonymous.success
        ? parsedAnonymous.output
        : undefined,
    };

    try {
      await api.featureRequests.react(payload);
    } catch (error) {
      console.error("Failed to react to feature request", error);
    }

    revalidatePath(`/${productId}`);
  };
};

export type ReactToFeature = ReturnType<typeof createReactToFeature>;
