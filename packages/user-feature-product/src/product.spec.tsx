import { composeStories } from "@storybook/nextjs-vite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

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
  useRouter: () => ({
    replace: navigationMocks.replace,
  }),
  useSearchParams: () => navigationMocks.searchParams,
}));

vi.mock("@repo/ui/components", async () => {
  const actual = await vi.importActual<typeof import("@repo/ui/components")>(
    "@repo/ui/components",
  );
  return {
    ...actual,
    MdxContent: ({ source }: { source: string }) => (
      <div data-testid="mdx-mock">{source}</div>
    ),
  };
});

const waitForDialog = () =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 0);
  });

const openDialog = async (index = 0) => {
  const triggers = document.querySelectorAll<HTMLButtonElement>(
    "[data-slot='dialog-trigger']",
  );
  const trigger = triggers.item(index) ?? null;
  trigger?.click();
  await waitForDialog();
};

beforeEach(() => {
  navigationMocks.searchParams = new URLSearchParams();
  navigationMocks.replace.mockReset();
});

const createProductFixture = (ownerId: string) => ({
  featureRequests: [
    {
      content: "ユーザーがプロフィール画像をアップロードできるようにする",
      contentNode: (
        <div>
          <h2>プロフィール画像アップロード</h2>
          <p>ユーザーがプロフィール画像をアップロードできるようにする</p>
        </div>
      ),
      id: 1,
      reactionSummaries: [],
      status: "open",
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
  name: "Sample Product",
});

describe("Product", () => {
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
          featureRequests: [],
          id: 1,
          name: "Sample Product",
        }}
      />,
    );

    expect(asFragment()).toMatchSnapshot();
    await expect.element(baseElement).toMatchScreenshot();
  });

  it("opens feature detail when openFeatureRequestId matches", async () => {
    await render(
      <Product
        canCreateFeatureRequest
        currentUserId="user-owner"
        onCreateFeatureRequest={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onReactToFeature={async () => {}}
        openFeatureRequestId={1}
        product={createProductFixture("user-owner")}
      />,
    );

    await waitForDialog();

    expect(document.body.textContent ?? "").toContain(
      "プロフィール画像アップロード",
    );
  });

  it("omits delete action when the viewer is not the creator", async () => {
    await render(
      <Product
        canCreateFeatureRequest
        currentUserId="other-user"
        onCreateFeatureRequest={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onReactToFeature={async () => {}}
        product={createProductFixture("user-owner")}
      />,
    );

    await openDialog();

    expect(document.body.textContent).not.toContain("リクエストを削除");
  });
});
