import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestContent } from "./feature-request-content";

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

afterEach(() => {
  document.body.innerHTML = "";
});

describe("FeatureRequestContent", () => {
  it("renders MDX preview and no editor when not owner", async () => {
    await render(
      <FeatureRequestContent
        content="Hello **MDX**"
        featureId={1}
        isOwner={false}
      />,
    );

    expect(document.body.textContent).toContain("Hello **MDX**");
    expect(document.querySelector("button")).toBeNull();
  });

  it("renders editor button when owner and handler provided", async () => {
    await render(
      <FeatureRequestContent
        content="Owner content"
        featureId={2}
        isOwner={true}
        onUpdateFeatureRequest={async () => {}}
      />,
    );

    expect(document.body.textContent).toContain("Owner content");
    // editor renders a button labelled 編集
    expect(document.body.textContent).toContain("編集");
  });
});
