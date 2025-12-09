import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { RequestInput } from "./request-input";
import * as stories from "./request-input.stories";

const Stories = composeStories(stories);

describe("RequestInput", () => {
  it.each(Object.entries(Stories))("should %s screenshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders avatar and input with helper text", async () => {
    await render(
      <RequestInput
        avatar={{ fallbackText: "UI" }}
        helperText="入力してください"
        name="request"
      />,
    );

    const avatarFallback = document.querySelector(
      "[data-slot='avatar-fallback']",
    );
    expect(avatarFallback?.textContent).toBe("UI");

    const input = document.querySelector("input[name='request']");
    expect(input).not.toBeNull();

    const helper = document.querySelector("[data-slot='text']");
    expect(helper?.textContent).toContain("入力してください");
  });
});
