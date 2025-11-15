import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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

    if (!Number.isInteger(featureId) || featureId <= 0) {
      return;
    }

    if (typeof emoji !== "string" || emoji.length === 0) {
      return;
    }

    if (action !== "up" && action !== "down") {
      return;
    }

    const cookieStore = await cookies();
    const cookieName = "fequestAnonId";
    let anonymousIdentifier = cookieStore.get(cookieName)?.value;

    if (!anonymousIdentifier) {
      anonymousIdentifier = crypto.randomUUID();
      cookieStore.set({
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        name: cookieName,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        value: anonymousIdentifier,
      });
    }

    try {
      await api.featureRequests.react({
        action,
        anonymousIdentifier,
        emoji,
        id: featureId,
      });
    } catch (error) {
      console.error("Failed to react to feature request", error);
    }

    revalidatePath(`/${productId}`);
  };
};

export type ReactToFeature = ReturnType<typeof createReactToFeature>;
