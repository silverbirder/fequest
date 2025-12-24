import { jaMessages } from "@repo/messages";
import { idSchema } from "@repo/schema";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { object, safeParse } from "valibot";

import { api } from "~/trpc/server";

const paramsSchema = object({
  id: idSchema,
});

export const size = {
  height: 630,
  width: 1200,
};

export const contentType = "image/png";

const getInitial = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "?";
  return trimmed[0]?.toUpperCase() ?? "?";
};

const looksLikeSvg = (buffer: ArrayBuffer) => {
  const view = new Uint8Array(buffer.slice(0, 256));
  const text = new TextDecoder().decode(view);
  return /<svg[\s>]/i.test(text);
};

const normalizeSvg = (svgText: string) =>
  svgText.replace(/<svg\b/i, '<svg width="100%" height="100%"');

const toSvgDataUrl = (svgText: string) => {
  const normalized = normalizeSvg(svgText);
  const encoded = Buffer.from(normalized).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
};

const resolveImage = async (value: null | string) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  try {
    const response = await fetch(trimmed);
    if (!response.ok) return null;

    const contentType =
      response.headers.get("content-type")?.toLowerCase() ?? "";
    if (contentType.includes("image/svg+xml")) {
      const svgText = await response.text();
      return toSvgDataUrl(svgText);
    }

    if (contentType.startsWith("image/")) {
      return trimmed;
    }

    const buffer = await response.arrayBuffer();
    if (looksLikeSvg(buffer)) {
      const svgText = new TextDecoder().decode(buffer);
      return toSvgDataUrl(svgText);
    }

    return trimmed;
  } catch {
    return null;
  }
};

export default async function Image({ params }: PageProps<"/[id]">) {
  const resolvedParams = await params;
  const parsedParams = safeParse(paramsSchema, resolvedParams);

  if (!parsedParams.success) {
    notFound();
  }

  const product = await api.product.byId({ id: parsedParams.output.id });

  if (!product) {
    notFound();
  }

  const appName = jaMessages.UserFeatureTop.appName;
  const appEmoji = jaMessages.UI.icons.ballotEmoji;
  const productName = product.name;
  const logoUrl = await resolveImage(product.logoUrl);
  const creatorName = product.user.name ?? "";
  const creatorAvatarUrl = await resolveImage(product.user.image);
  const creatorInitial = getInitial(creatorName);
  const productInitial = getInitial(productName);

  const [fontRegular, fontBold] = await Promise.all([
    readFile(new URL("../_assets/og/NotoSansJP-Regular.ttf", import.meta.url)),
    readFile(new URL("../_assets/og/NotoSansJP-Bold.ttf", import.meta.url)),
  ]);

  const bgColor = "#ebeff2";
  const bgMuteColor = "#d4e8f5";

  return new ImageResponse(
    (
      <div
        style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
        tw={`flex h-full w-full flex-col items-center p-6 bg-[${bgColor}]`}
      >
        <div tw="flex flex-1 flex-col items-center justify-center">
          <div tw="flex flex-col items-center">
            <div tw="relative flex flex-col">
              {logoUrl ? (
                <img
                  alt=""
                  height={180}
                  src={logoUrl}
                  style={{ objectFit: "contain" }}
                  width={180}
                />
              ) : (
                <div
                  tw={`h-[180px] w-[180px] overflow-hidden rounded-md bg-[${bgMuteColor}] flex items-center justify-center`}
                >
                  <span tw="text-[64px] font-bold">{productInitial}</span>
                </div>
              )}
              <div
                tw={`absolute -bottom-12 -right-12 flex h-[84px] w-[84px] items-center justify-center overflow-hidden rounded-full border-4 border-[${bgColor}] bg-white`}
              >
                {creatorAvatarUrl ? (
                  <img
                    alt=""
                    height={84}
                    src={creatorAvatarUrl}
                    style={{ objectFit: "cover" }}
                    width={84}
                  />
                ) : (
                  <span tw="text-[28px] font-bold">{creatorInitial}</span>
                )}
              </div>
            </div>
            <span tw="mt-10 text-6xl font-bold">{productName}</span>
          </div>
        </div>
        <div tw="flex items-center justify-center">
          <span tw="text-3xl font-bold uppercase tracking-[0.18em] text-slate-700">
            {appName}
          </span>
          <span tw="ml-2 text-3xl">{appEmoji}</span>
        </div>
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
