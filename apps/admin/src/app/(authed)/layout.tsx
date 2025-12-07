import { Header } from "@repo/ui/components";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { auth, signIn, signOut } from "~/server/auth";

type Props = Readonly<{
  children: ReactNode;
}>;

const ConsoleLayout = async ({ children }: Props) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  const signInWithGoogle = async () => {
    "use server";
    await signIn("google", { redirectTo: "/" });
  };

  const signOutUser = async () => {
    "use server";
    await signOut({ redirectTo: "/sign-in" });
  };

  return (
    <>
      <Header
        appName="Fequest Admin"
        loginAction={signInWithGoogle}
        logoutAction={signOutUser}
        user={session?.user}
      />
      {children}
    </>
  );
};

export default ConsoleLayout;
