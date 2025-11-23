import { afterEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Product } from "./product";

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

afterEach(() => {
  document.body.innerHTML = "";
});

const createProductFixture = (ownerId: string) => ({
  featureRequests: [
    {
      content: "ユーザーがプロフィール画像をアップロードできるようにする",
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

  it("shows delete action when the current user owns a feature request", async () => {
    await render(
      <Product
        canCreateFeatureRequest
        currentUserId="user-owner"
        onCreateFeatureRequest={async () => {}}
        onDeleteFeatureRequest={async () => {}}
        onReactToFeature={async () => {}}
        product={createProductFixture("user-owner")}
      />,
    );

    await openDialog();

    expect(document.body.textContent).toContain("リクエストを削除");
  });

  it.skip("omits delete action when the viewer is not the creator", async () => {
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
