import { beforeEach, describe, expect, it, vi } from "vitest";

const { notFoundMock } = vi.hoisted(() => ({
  notFoundMock: vi.fn(() => {
    throw new Error("not-found");
  }),
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

vi.mock("~/server/auth", () => ({
  auth: vi.fn(),
}));

import { jaMessages } from "@repo/messages";

import { api } from "~/trpc/server";

import { generateMetadata } from "./page";

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

describe("page metadata", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    vi.mocked(api.product.byId).mockReset();
  });

  it("builds title and description from product", async () => {
    const appName = jaMessages.UserFeatureTop.appName;
    vi.mocked(api.product.byId).mockResolvedValue(
      buildProduct({
        description: "  Fast feedback  ",
        id: 12,
        name: "  Fequest Pro ",
      }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "12" }),
    } as PageProps<"/[id]">);

    expect(metadata.title).toBe(`Fequest Pro | ${appName}`);
    expect(metadata.description).toBe("Fast feedback");
    const images = metadata.openGraph?.images;
    const firstImage = Array.isArray(images) ? images[0] : images;
    expect(firstImage).toEqual({ url: "/12/opengraph-image" });
  });

  it("falls back to default description when empty", async () => {
    vi.mocked(api.product.byId).mockResolvedValue(
      buildProduct({
        description: "   ",
      }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "1" }),
    } as PageProps<"/[id]">);

    expect(metadata.description).toBe("機能リクエスト・共有プラットフォーム");
  });

  it("calls notFound when params are invalid", async () => {
    await expect(
      generateMetadata({
        params: Promise.resolve({ id: "abc" }),
      } as PageProps<"/[id]">),
    ).rejects.toThrow("not-found");

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("calls notFound when product is missing", async () => {
    vi.mocked(api.product.byId).mockResolvedValue(null);

    await expect(
      generateMetadata({
        params: Promise.resolve({ id: "2" }),
      } as PageProps<"/[id]">),
    ).rejects.toThrow("not-found");

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });
});
