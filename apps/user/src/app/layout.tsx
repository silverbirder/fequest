import "@repo/ui/globals.css";
import { Providers } from "@repo/ui/providers/theme-provider";
import { Header } from "@repo/user-feature-header";
import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { auth, signIn } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  description: "機能リクエストができるサービスです。",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  title: "Fequest",
};

const geist = Geist({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  const signInWithGoogle = async () => {
    "use server";
    await signIn("google");
  };

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={geist.className}>
        <TRPCReactProvider>
          <Providers>
            <Header
              loginAction={signInWithGoogle}
              user={session?.user ?? null}
            />
            {children}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
