import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { BubbleInput } from "./bubble-input";
import * as stories from "./bubble-input.stories";

const Stories = composeStories(stories);

describe("BubbleInput", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = "";
  });

  it("accepts helper text and input props", async () => {
    await render(<BubbleInput helperText="送信準備" name="request" />);

    const helper = document.querySelector('[data-slot="text"]');
    expect(helper?.textContent).toBe("送信準備");

    const input = document.querySelector("input[name=request]");
    expect(input).not.toBeNull();
  });
});
