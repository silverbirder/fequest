import { SignIn } from "@repo/admin-feature-sign-in";
import { redirect } from "next/navigation";

import { auth, signIn } from "~/server/auth";

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  const signInWithGoogle = async () => {
    "use server";
    await signIn("google", { redirectTo: "/" });
  };

  return <SignIn onGoogleSignIn={signInWithGoogle} />;
}
