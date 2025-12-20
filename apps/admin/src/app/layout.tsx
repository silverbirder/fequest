import { Toaster } from "@repo/ui/components";
import "@repo/ui/globals.css";
import { Providers } from "@repo/ui/providers/theme-provider";
import { type Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Noto_Sans_JP } from "next/font/google";
import { type ReactNode } from "react";

import { TRPCReactProvider } from "~/trpc/react";

const baseUrl = process.env.BASE_URL ?? "https://fequest-admin.vercel.app";

export const metadata: Metadata = {
  description: "機能リクエスト・共有プラットフォームの管理",
  icons: [{ rel: "icon", url: "/icon/48" }],
  metadataBase: new URL(baseUrl),
  robots: {
    index: true,
  },
  title: "Fequest Admin",
};

const notoSansJP = Noto_Sans_JP({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

type Props = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
  const messages = await getMessages();

  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <TRPCReactProvider>
          <NextIntlClientProvider messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
