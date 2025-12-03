import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { FeatureRequestContent } from "./feature-request-content";

const waitForNextTick = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("FeatureRequestContent", () => {
  it("renders content and no editor when not owner", async () => {
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
    expect(document.querySelector("button")).not.toBeNull();
  });

  it("opens editor when owner clicks edit", async () => {
    await render(
      <FeatureRequestContent
        content="Editable content"
        featureId={3}
        isOwner
        onUpdateFeatureRequest={async () => {}}
      />,
    );

    document.querySelector<HTMLButtonElement>("button")?.click();

    await waitForNextTick();

    const textarea = document.querySelector("textarea");
    expect(textarea).not.toBeNull();
    expect(textarea?.value).toBe("Editable content");
  });

  it("closes editor after successful save", async () => {
    const updateFeatureRequest = vi.fn(async () => {});

    await render(
      <FeatureRequestContent
        content="Editable content"
        featureId={4}
        isOwner
        onUpdateFeatureRequest={updateFeatureRequest}
      />,
    );

    document
      .querySelector<HTMLButtonElement>('button[aria-label="編集する"]')
      ?.click();

    await waitForNextTick();

    document.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();

    await waitForNextTick();

    expect(updateFeatureRequest).toHaveBeenCalledOnce();
    expect(document.querySelector("textarea")).toBeNull();
  });
});
