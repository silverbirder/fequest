import { beforeEach, describe, expect, it, vi } from "vitest";

const notFoundMock = vi.fn(() => {
  throw new Error("not-found");
});

vi.mock("next/og", () => ({
  ImageResponse: vi.fn((jsx, options) => ({ jsx, options })),
}));

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("~/trpc/server", () => ({
  api: {
    product: {
      byId: vi.fn(),
    },
  },
}));

import { jaMessages } from "@repo/messages";

import { api } from "~/trpc/server";

import Image, { size } from "./opengraph-image";

type ProductById = NonNullable<Awaited<ReturnType<typeof api.product.byId>>>;

const buildProduct = (overrides: Partial<ProductById>): ProductById => ({
  description: null,
  featureRequests: [],
  homePageUrl: null,
  id: 1,
  logoUrl: null,
  name: "Fequest",
  user: {
    image: null,
    name: null,
  },
  ...overrides,
});

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

const extractImageSrcs = (node: unknown): string[] => {
  if (node == null || typeof node === "boolean") {
    return [];
  }

  if (Array.isArray(node)) {
    return node.flatMap(extractImageSrcs);
  }

  if (typeof node === "object") {
    const element = node as {
      props?: { children?: unknown; src?: unknown };
    };
    const sources: string[] = [];
    if (typeof element.props?.src === "string") {
      sources.push(element.props.src);
    }
    if (element.props?.children) {
      sources.push(...extractImageSrcs(element.props.children));
    }
    return sources;
  }

  return [];
};

describe("opengraph-image", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    vi.mocked(api.product.byId).mockReset();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("renders product name and app name", async () => {
    const appName = jaMessages.UserFeatureTop.appName;
    vi.mocked(fetch).mockResolvedValue({
      arrayBuffer: vi.fn(),
      headers: new Headers([["content-type", "image/png"]]),
      ok: true,
    } as unknown as Response);
    vi.mocked(api.product.byId).mockResolvedValue(
      buildProduct({
        description: "  Build faster. ",
        logoUrl: null,
        name: "  Fequest Pro  ",
      }),
    );

    const result = await Image({
      params: Promise.resolve({ id: "12" }),
    } as PageProps<"/[id]">);

    const { jsx, options } = result as unknown as {
      jsx: unknown;
      options: typeof size;
    };
    const text = extractText(jsx);

    expect(text).toContain("Fequest Pro");
    expect(text).toContain(appName);
    expect(options).toEqual(size);
  });

  it("falls back to defaults when product strings are empty", async () => {
    const appName = jaMessages.UserFeatureTop.appName;
    vi.mocked(fetch).mockResolvedValue({
      arrayBuffer: vi.fn(),
      headers: new Headers([["content-type", "image/png"]]),
      ok: true,
    } as unknown as Response);
    vi.mocked(api.product.byId).mockResolvedValue(
      buildProduct({
        description: " ",
        logoUrl: null,
        name: " ",
      }),
    );

    const result = await Image({
      params: Promise.resolve({ id: "3" }),
    } as PageProps<"/[id]">);

    const { jsx } = result as unknown as { jsx: unknown };
    const text = extractText(jsx);

    expect(text).toContain(appName);
  });

  it("calls notFound when params are invalid", async () => {
    await expect(
      Image({
        params: Promise.resolve({ id: "abc" }),
      } as PageProps<"/[id]">),
    ).rejects.toThrow("not-found");

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("inlines svg images as data urls", async () => {
    const svgMarkup =
      '<svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" /></svg>';
    vi.mocked(fetch).mockResolvedValue({
      arrayBuffer: vi.fn(),
      headers: new Headers([["content-type", "image/svg+xml"]]),
      ok: true,
      text: vi.fn().mockResolvedValue(svgMarkup),
    } as unknown as Response);
    vi.mocked(api.product.byId).mockResolvedValue(
      buildProduct({
        logoUrl: "https://example.com/logo.svg?seed=1",
        user: {
          image: "https://example.com/avatar?format=svg&seed=2",
          name: "Creator",
        },
      }),
    );

    const result = await Image({
      params: Promise.resolve({ id: "9" }),
    } as PageProps<"/[id]">);

    const { jsx } = result as unknown as { jsx: unknown };
    const sources = extractImageSrcs(jsx);

    expect(
      sources.some((src) => src.startsWith("data:image/svg+xml;base64,")),
    ).toBe(true);
  });
});
