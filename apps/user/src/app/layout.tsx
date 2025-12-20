import "@repo/ui/globals.css";
import {
  Center,
  Container,
  Header,
  Toaster,
  VStack,
} from "@repo/ui/components";
import { Providers } from "@repo/ui/providers/theme-provider";
import { type Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Noto_Sans_JP } from "next/font/google";

import { env } from "~/env";
import { auth, signIn, signOut } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

const baseUrl = process.env.BASE_URL ?? "https://fequest.vercel.app";

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

  const signInWithGoogle = async () => {
    "use server";
    await signIn("google");
  };

  const signOutUser = async () => {
    "use server";
    await signOut();
  };

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <TRPCReactProvider>
          <NextIntlClientProvider messages={messages}>
            <Providers>
              <VStack gap="lg" pb="2xl">
                <Header
                  appendLink={{
                    href: env.ADMIN_DOMAIN_URL,
                    label: "管理ページへ",
                  }}
                  loginAction={signInWithGoogle}
                  logoutAction={signOutUser}
                  user={session?.user}
                />
                <Container size="lg">
                  <Center>{children}</Center>
                </Container>
              </VStack>
            </Providers>
          </NextIntlClientProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
