import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { AppLogo } from "./app-logo";
import * as stories from "./app-logo.stories";

const Stories = composeStories(stories);

describe("AppLogo", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders label with emoji", async () => {
    await render(<AppLogo emoji="✅" label="AppName" />);

    const container = document.querySelector<HTMLElement>(
      "[data-slot='app-logo']",
    );

    expect(container?.textContent).toContain("AppName");
    expect(container?.textContent?.split("✅").length).toBe(4);
  });

  it("uses children when provided", async () => {
    await render(
      <AppLogo>
        <span data-testid="custom-label">Custom</span>
      </AppLogo>,
    );

    const custom = document.querySelector("[data-testid='custom-label']");

    expect(custom?.textContent).toBe("Custom");
  });
});
