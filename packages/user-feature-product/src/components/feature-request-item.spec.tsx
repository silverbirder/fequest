import { composeStories } from "@storybook/nextjs-vite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestItem } from "./feature-request-item";
import * as stories from "./feature-request-item.stories";

const Stories = composeStories(stories);

const mocks = vi.hoisted(() => ({
  pathname: "/products/1",
  replace: vi.fn(),
  searchParams: new URLSearchParams(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
  useRouter: () => ({
    replace: mocks.replace,
  }),
  useSearchParams: () => mocks.searchParams,
}));

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

const baseDetail = {
  content: (
    <div>
      <h2>Heading</h2>
      <ul>
        <li>item1</li>
        <li>item2</li>
      </ul>
    </div>
  ),
  createdAt: "2024-01-01T00:00:00.000Z",
  title: "Child feature",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

const renderItem = (
  overrides: Partial<Parameters<typeof FeatureRequestItem>[0]> = {},
) =>
  render(
    <FeatureRequestItem
      avatar={{ fallbackText: "FR" }}
      detail={baseDetail}
      featureId={1}
      onReactToFeature={async () => {}}
      reactions={[]}
      text="Child feature"
      {...overrides}
    />,
  );

beforeEach(() => {
  mocks.searchParams = new URLSearchParams();
  mocks.replace.mockReset();
});

describe("FeatureRequestItem", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("shows the delete action when deletion is allowed", async () => {
    await renderItem({
      canDelete: true,
      onDeleteFeatureRequest: async () => {},
    });

    await openDialog();

    expect(document.body.textContent).toContain("削除");
  });

  it("renders custom emoji reactions from props", async () => {
    await renderItem({
      reactions: [{ count: 3, emoji: "✅", reactedByViewer: false }],
    });

    const reactionButton = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent?.includes("✅3"),
    );

    expect(reactionButton).toBeDefined();
  });

  it("removes open param when dialog closes", async () => {
    mocks.searchParams = new URLSearchParams("open=1");

    await renderItem({
      defaultOpen: true,
      featureId: 1,
    });

    await waitForDialog();

    const closeButton = document.querySelector<HTMLButtonElement>(
      "[data-slot='dialog-close']",
    );
    closeButton?.click();

    await waitForDialog();

    expect(mocks.replace).toHaveBeenLastCalledWith("/products/1", {
      scroll: false,
    });
  });

  it("adds open param when dialog opens", async () => {
    mocks.searchParams = new URLSearchParams();

    await renderItem({
      defaultOpen: false,
      featureId: 2,
    });

    await openDialog();

    expect(mocks.replace).toHaveBeenLastCalledWith("/products/1?open=2", {
      scroll: false,
    });
  });

  it.skip("does not show the delete action when deletion is not allowed", async () => {
    await renderItem({
      canDelete: false,
      onDeleteFeatureRequest: async () => {},
    });

    await openDialog();

    expect(document.body.textContent).not.toContain("リクエストを削除");
  });
});
