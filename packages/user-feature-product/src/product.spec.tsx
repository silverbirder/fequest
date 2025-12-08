import { type FeatureRequestStatus } from "@repo/type";
import { composeStories } from "@storybook/nextjs-vite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { type ReactionSummary } from "./libs/reaction-summary";
import { Product } from "./product";
import * as stories from "./product.stories";

const Stories = composeStories(stories);

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

const createProductFixture = (ownerId: string) => ({
  description: "プロダクトの説明文です。",
  featureRequests: [
    {
      content: "ユーザーがプロフィール画像をアップロードできるようにする",
      id: 1,
      reactionSummaries: [] as ReactionSummary[],
      status: "open" as FeatureRequestStatus,
      title: "プロフィール画像アップロード",
      updatedAt: "2024-01-02T00:00:00.000Z",
      user: {
        id: ownerId,
        image: "https://placehold.co/48x48",
        name: "田中 花子",
      },
    },
  ],
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
        currentUserId="user-owner"
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
        currentUserId="other-user"
        onCreateFeatureRequest={async () => {}}
        onReactToFeature={async () => {}}
        product={createProductFixture("user-owner")}
      />,
    );

    expect(document.body.textContent).not.toContain("編集ページを開く");
  });
});
