import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { BubbleInput } from "./bubble-input";
import * as stories from "./bubble-input.stories";

const { Default } = composeStories(stories);

describe("BubbleInput", () => {
  it("accepts helper text and input props", async () => {
    await render(<BubbleInput helperText="送信準備" name="request" />);

    const helper = document.querySelector('[data-slot="text"]');
    expect(helper?.textContent).toBe("送信準備");

    const input = document.querySelector("input[name=request]");
    expect(input).not.toBeNull();
  });

  it("matches Default story snapshot", async () => {
    await Default.run();

    await expect(document.body).toMatchScreenshot();
  });
});
