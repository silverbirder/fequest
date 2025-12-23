import { describe, expect, it, vi } from "vitest";

vi.mock("next/og", () => ({
  ImageResponse: vi.fn((jsx, options) => ({ jsx, options })),
}));

import { jaMessages } from "@repo/messages";

import Image, { size } from "./opengraph-image";

const extractText = (node: unknown): string => {
  if (node == null || typeof node === "boolean") {
    return "";
  }

  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(extractText).join(" ");
  }

  if (typeof node === "object") {
    const props = (node as { props?: { children?: unknown } }).props;
    return extractText(props?.children);
  }

  return "";
};

describe("top opengraph-image", () => {
  it("renders app name and tagline", async () => {
    const result = await Image();

    const { jsx, options } = result as unknown as {
      jsx: unknown;
      options: typeof size;
    };
    const text = extractText(jsx);

    expect(text).toContain(jaMessages.UserFeatureTop.appName);
    expect(text).toContain(jaMessages.UserFeatureTop.hero.tagline);
    expect(options).toEqual(size);
  });
});
