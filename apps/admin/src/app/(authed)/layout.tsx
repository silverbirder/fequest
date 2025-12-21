import { Center, Container, Header, VStack } from "@repo/ui/components";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";

import { env } from "~/env";
import { auth, signIn, signOut } from "~/server/auth";

type Props = Readonly<{
  children: ReactNode;
}>;

const Layout = async ({ children }: Props) => {
  const session = await auth();
  const t = await getTranslations("AdminApp");

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
    <VStack gap="lg" pb="2xl">
      <Header
        appName="Fequest Admin"
        links={[
          {
            external: true,
            href: { href: env.USER_DOMAIN_URL },
            label: t("userPageLinkLabel"),
          },
          {
            href: "/setting",
            label: t("settingLinkLabel"),
          },
        ]}
        loginAction={signInWithGoogle}
        logoutAction={signOutUser}
        user={session?.user}
      />
      <Container size="lg">
        <Center>{children}</Center>
      </Container>
    </VStack>
  );
};

export default Layout;
