import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestItem } from "./feature-request-item";

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
  content: "Feature detail body",
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

describe("FeatureRequestItem", () => {
  it("shows the delete action when deletion is allowed", async () => {
    await renderItem({
      canDelete: true,
      onDeleteFeatureRequest: async () => {},
    });

    await openDialog();

    expect(document.body.textContent).toContain("リクエストを削除");
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

  it.skip("does not show the delete action when deletion is not allowed", async () => {
    await renderItem({
      canDelete: false,
      onDeleteFeatureRequest: async () => {},
    });

    await openDialog();

    expect(document.body.textContent).not.toContain("リクエストを削除");
  });
});
