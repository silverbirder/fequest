import { jaMessages } from "@repo/messages";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

export default async function Image() {
  const appName = jaMessages.UserFeatureTop.appName;
  const tagline = jaMessages.UserFeatureTop.hero.tagline;
  const appEmoji = jaMessages.UI.icons.ballotEmoji;

  const [fontRegular, fontBold] = await Promise.all([
    readFile(new URL("./_assets/og/NotoSansJP-Regular.ttf", import.meta.url)),
    readFile(new URL("./_assets/og/NotoSansJP-Bold.ttf", import.meta.url)),
  ]);

  const bgColor = "#f0f6f9";
  const accentColor = "#0f172a";

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: bgColor,
          color: accentColor,
          fontFamily: '"Noto Sans JP", sans-serif',
        }}
        tw="flex h-full w-full flex-col items-center justify-center px-16"
      >
        <div tw="flex items-center">
          <span tw="text-6xl font-bold">{appName}</span>
          <span tw="ml-4 text-5xl">{appEmoji}</span>
        </div>
        <span tw="mt-6 text-3xl text-slate-700">{tagline}</span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          data: fontRegular,
          name: "Noto Sans JP",
          style: "normal",
          weight: 400,
        },
        {
          data: fontBold,
          name: "Noto Sans JP",
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
