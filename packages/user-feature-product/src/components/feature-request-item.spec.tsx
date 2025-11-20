import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestItem } from "./feature-request-item";

const defaultReactions = [
  { count: 3, emoji: "👍", reactedByViewer: false },
  { count: 1, emoji: "🎉", reactedByViewer: true },
];

describe("FeatureRequestItem", () => {
  it("renders text and reactions", async () => {
    const onReact = vi.fn();
    const { baseElement } = await render(
      <FeatureRequestItem
        avatar={{ fallbackText: "FR" }}
        detail={{
          content: "詳細な説明をここに入れます",
          createdAt: "2024-12-01T00:00:00.000Z",
          title: "検索機能を改善してほしい",
          updatedAt: "2024-12-02T00:00:00.000Z",
        }}
        featureId={99}
        onReactToFeature={onReact}
        reactions={defaultReactions}
        text="検索機能を改善してほしい"
      />,
    );

    await expect
      .element(baseElement)
      .toHaveTextContent("検索機能を改善してほしい");
    await expect.element(baseElement).toHaveTextContent("👍");
    await expect.element(baseElement).toHaveTextContent("🎉");
  });
});
