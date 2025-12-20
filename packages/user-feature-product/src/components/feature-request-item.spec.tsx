import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestItem } from "./feature-request-item";
import * as stories from "./feature-request-item.stories";

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

const waitForDialog = (delay = 25) =>
  new Promise<void>((resolve) => {
    setTimeout(() => resolve(), delay);
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
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      <FeatureRequestItem
        avatar={{ fallbackText: "FR" }}
        detail={baseDetail}
        featureId={1}
        onReactToFeature={async () => {}}
        reactions={[]}
        text="Child feature"
        {...overrides}
      />
    </NextIntlClientProvider>,
  );

beforeEach(() => {
  navigationMocks.searchParams = new URLSearchParams();
  navigationMocks.replace.mockReset();
});

describe("FeatureRequestItem", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("shows the edit link when provided", async () => {
    await renderItem({
      editHref: { pathname: "/products/1/1/edit" },
    });

    await openDialog();
    await waitForDialog(50);

    const link = document.querySelector(
      `a[aria-label='${jaMessages.UserFeatureProduct.editLinkAriaLabel}']`,
    );
    expect(link).not.toBeNull();
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

  it("keeps dialog closed until trigger is clicked", async () => {
    await renderItem();

    const dialogBefore = document.querySelector("[role='dialog']");
    expect(dialogBefore).toBeNull();

    await openDialog();

    await waitForDialog(50);

    const dialogAfter = document.querySelector("[role='dialog']");
    expect(dialogAfter?.textContent ?? "").toContain("Child feature");
  });

  it("shows closed badge when status is closed", async () => {
    await renderItem({ status: "closed" });

    const badge = Array.from(document.querySelectorAll("span")).find((node) =>
      (node.textContent ?? "").includes("完了"),
    );

    expect(badge).toBeDefined();
  });

  it("sets data-feature-status on wrapper", async () => {
    await renderItem({ status: "closed" });

    const wrapper = document.querySelector('[data-feature-status="closed"]');
    expect(wrapper).not.toBeNull();
  });

  it("removes open param when dialog closes", async () => {
    navigationMocks.searchParams = new URLSearchParams("open=1");

    await renderItem({ defaultOpen: true, featureId: 1 });

    await waitForDialog();

    document
      .querySelector<HTMLButtonElement>("[data-slot='dialog-close']")
      ?.click();

    await waitForDialog(50);

    expect(navigationMocks.replace).toHaveBeenLastCalledWith("/products/1", {
      scroll: false,
    });
  });
});
