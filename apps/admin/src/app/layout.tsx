import "@repo/ui/globals.css";
import { Providers } from "@repo/ui/providers/theme-provider";
import { type Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  description: "Fequestの管理画面です。",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  title: "Fequest Admin",
};

const notoSansJP = Noto_Sans_JP({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={notoSansJP.className}>
        <TRPCReactProvider>
          <Providers>{children}</Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
