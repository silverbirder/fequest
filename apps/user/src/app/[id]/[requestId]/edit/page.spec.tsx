import { beforeEach, describe, expect, it, vi } from "vitest";

const notFoundMock = vi.fn(() => {
  throw new Error("not-found");
});

vi.mock("next/navigation", () => ({
  notFound: notFoundMock,
}));

vi.mock("~/trpc/server", () => ({
  api: {
    featureRequests: {
      byId: vi.fn(),
    },
  },
}));

import { jaMessages } from "@repo/messages";

import { api } from "~/trpc/server";

import { generateMetadata } from "./page";

type FeatureRequestById = NonNullable<
  Awaited<ReturnType<typeof api.featureRequests.byId>>
>;

const buildFeatureRequest = (
  overrides: Partial<FeatureRequestById>,
): FeatureRequestById => ({
  content: "",
  id: 1,
  product: {
    id: 10,
    name: "Fequest",
  },
  productId: 10,
  title: "Change theme",
  user: {
    id: "user-1",
    image: null,
    name: null,
  },
  userId: "user-1",
  ...overrides,
});

describe("request edit metadata", () => {
  beforeEach(() => {
    notFoundMock.mockClear();
    vi.mocked(api.featureRequests.byId).mockReset();
  });

  it("builds title and description from request", async () => {
    vi.mocked(api.featureRequests.byId).mockResolvedValue(
      buildFeatureRequest({
        product: { id: 10, name: "Fequest Pro" },
        title: "  Faster exports  ",
      }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "10", requestId: "2" }),
    } as PageProps<"/[id]/[requestId]/edit">);

    const appName = jaMessages.UserFeatureTop.appName;
    const editTitle = jaMessages.UserFeatureRequestEdit.title;

    expect(metadata.title).toBe(`${editTitle} | ${appName}`);
    expect(metadata.description).toBe(
      "Fequest Pro へのリクエスト「Faster exports」を更新します。",
    );
  });

  it("falls back when request title is empty", async () => {
    vi.mocked(api.featureRequests.byId).mockResolvedValue(
      buildFeatureRequest({
        product: { id: 10, name: "Fequest Pro" },
        title: "  ",
      }),
    );

    const metadata = await generateMetadata({
      params: Promise.resolve({ id: "10", requestId: "2" }),
    } as PageProps<"/[id]/[requestId]/edit">);

    expect(metadata.description).toBe(
      "Fequest Pro へのリクエストを更新します。",
    );
  });

  it("calls notFound when params are invalid", async () => {
    await expect(
      generateMetadata({
        params: Promise.resolve({ id: "abc", requestId: "2" }),
      } as PageProps<"/[id]/[requestId]/edit">),
    ).rejects.toThrow("not-found");

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });

  it("calls notFound when request is missing", async () => {
    vi.mocked(api.featureRequests.byId).mockResolvedValue(null);

    await expect(
      generateMetadata({
        params: Promise.resolve({ id: "10", requestId: "2" }),
      } as PageProps<"/[id]/[requestId]/edit">),
    ).rejects.toThrow("not-found");

    expect(notFoundMock).toHaveBeenCalledTimes(1);
  });
});
