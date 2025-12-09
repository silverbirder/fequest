import { composeStories } from "@storybook/nextjs-vite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { type ReactionSummary } from "./libs/reaction-summary";
import { Product } from "./product";
import * as stories from "./product.stories";

const Stories = composeStories(stories);

type FeatureRequest = NonNullable<ProductData["featureRequests"]>[number];
type ProductData = Parameters<typeof Product>[0]["product"];

const navigationMocks = vi.hoisted(() => ({
  pathname: "/products/1",
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigationMocks.pathname,
  useRouter: () => ({ replace: navigationMocks.replace }),
  useSearchParams: () => navigationMocks.searchParams,
}));

type FeatureRequestFixture = Partial<FeatureRequest> & { id: number };

const createFeatureFixture = (
  ownerId: string,
  overrides: FeatureRequestFixture,
): FeatureRequest => {
  const { id, ...rest } = overrides;
  const defaultUser = {
    id: ownerId,
    image: "https://placehold.co/48x48",
    name: "田中 花子",
  } satisfies FeatureRequest["user"];

  return {
    content: "ユーザーがプロフィール画像をアップロードできるようにする",
    createdAt: "2024-01-01T00:00:00.000Z",
    id,
    reactionSummaries: [] as ReactionSummary[],
    status: "open",
    title: "プロフィール画像アップロード",
    updatedAt: "2024-01-02T00:00:00.000Z",
    user: defaultUser,
    ...rest,
  } satisfies FeatureRequest;
};

const createProductFixture = (
  ownerId: string,
  featureRequests?: FeatureRequestFixture[],
): ProductData => ({
  description: "プロダクトの説明文です。",
  featureRequests: featureRequests?.map((feature) =>
    createFeatureFixture(ownerId, feature),
  ) ?? [createFeatureFixture(ownerId, { id: 1 })],
  id: 1,
  logoUrl: "https://placehold.co/120x120",
  name: "Sample Product",
});

describe("Product", () => {
  beforeEach(() => {
    navigationMocks.searchParams = new URLSearchParams();
    navigationMocks.replace.mockReset();
  });

  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders provided props", async () => {
    const { asFragment, baseElement } = await render(
      <Product
        canCreateFeatureRequest
        onCreateFeatureRequest={async () => {}}
        onReactToFeature={async () => {}}
        product={{
          description: "サンプルの説明文です。",
          featureRequests: [],
          id: 1,
          logoUrl: "https://placehold.co/120x120",
          name: "Sample Product",
        }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    await expect.element(baseElement).toMatchScreenshot();
  });

  const waitForDialog = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 0);
    });

  const openDialog = async () => {
    const trigger = document.querySelector<HTMLButtonElement>(
      "[data-slot='dialog-trigger']",
    );
    trigger?.click();
    await waitForDialog();
  };

  it("shows edit link for the owner", async () => {
    await render(
      <Product
        canCreateFeatureRequest
        currentUser={{ id: "user-owner" }}
        onCreateFeatureRequest={async () => {}}
        onReactToFeature={async () => {}}
        product={createProductFixture("user-owner")}
      />,
    );

    await openDialog();

    const editLinks = Array.from(
      document.querySelectorAll("a[aria-label='編集ページを開く']"),
    );
    expect(editLinks).toHaveLength(1);
  });

  it("omits edit link when the viewer is not the creator", async () => {
    await render(
      <Product
        canCreateFeatureRequest
        currentUser={{ id: "other-user" }}
        onCreateFeatureRequest={async () => {}}
        onReactToFeature={async () => {}}
        product={createProductFixture("user-owner")}
      />,
    );

    expect(document.body.textContent).not.toContain("編集ページを開く");
  });

  it("shows closed feature requests under the composer", async () => {
    await render(
      <Product
        canCreateFeatureRequest
        currentUser={{ id: "user-owner" }}
        onCreateFeatureRequest={async () => {}}
        onReactToFeature={async () => {}}
        product={createProductFixture("user-owner", [
          {
            content: "まだ未対応のリクエスト",
            id: 1,
            reactionSummaries: [],
            status: "open",
            title: "公開中のリクエスト",
          },
          {
            content: "完了した対応",
            id: 2,
            reactionSummaries: [],
            status: "closed",
            title: "クローズ済みリクエスト",
          },
        ])}
      />,
    );

    const closedRequest = Array.from(document.querySelectorAll("*"))
      .map((node) => node.textContent ?? "")
      .find((text) => text.includes("クローズ済みリクエスト"));

    expect(closedRequest).toBeDefined();

    const badge = Array.from(document.querySelectorAll("span")).find((node) =>
      (node.textContent ?? "").includes("完了"),
    );

    expect(badge).toBeDefined();
  });
});
