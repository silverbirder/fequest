import "@repo/ui/globals.css";
import {
  Center,
  Container,
  Footer,
  Header,
  Toaster,
  VStack,
} from "@repo/ui/components";
import { Providers } from "@repo/ui/providers/theme-provider";
import { getHueBaseFromCookieStore, toHueBaseCss } from "@repo/user-cookie";
import { type Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Noto_Sans_JP } from "next/font/google";
import { cookies } from "next/headers";

import { env } from "~/env";
import { auth, signIn, signOut } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";
const baseUrl =
  process.env.BASE_URL ??
  (env.NODE_ENV === "production"
    ? "https://fequest.vercel.app"
    : "http://localhost:3000");

export const metadata: Metadata = {
  description: "機能リクエスト・共有プラットフォーム",
  icons: [{ rel: "icon", url: "/icon/48" }],
  metadataBase: new URL(baseUrl),
  robots: {
    index: true,
  },
  title: "Fequest",
};

const notoSansJP = Noto_Sans_JP({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  const messages = await getMessages();
  const t = await getTranslations("UserApp");
  const cookieStore = await cookies();
  const hueBase = getHueBaseFromCookieStore(cookieStore);
  const rootStyle = {
    "--hue-base": toHueBaseCss(hueBase),
  } as React.CSSProperties;

  const signInWithGoogle = async () => {
    "use server";
    await signIn("google");
  };

  const signOutUser = async () => {
    "use server";
    await signOut();
  };

  return (
    <html lang="ja" style={rootStyle} suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <TRPCReactProvider>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <VStack gap="lg" pb="2xl">
                <Header
                  links={[
                    {
                      external: true,
                      href: { href: env.ADMIN_DOMAIN_URL },
                      label: t("adminPageLinkLabel"),
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
                <Footer />
              </VStack>
            </Providers>
          </NextIntlClientProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
