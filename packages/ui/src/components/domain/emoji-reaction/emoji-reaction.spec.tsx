import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { EmojiReaction } from "./emoji-reaction";
import * as stories from "./emoji-reaction.stories";

const Stories = composeStories(stories);

describe("EmojiReaction", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = "";
  });

  it("renders provided children", async () => {
    await render(<EmojiReaction count={5} emoji="😀" />);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("😀5");
  });

  it("calls onClick when clicked", async () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    await render(<EmojiReaction count={3} emoji="👍" onClick={handleClick} />);

    const button = document.querySelector("button");
    expect(button).not.toBeNull();

    button?.click();

    expect(clicked).toBe(true);
  });
});
