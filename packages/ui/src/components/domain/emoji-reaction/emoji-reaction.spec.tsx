import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { EmojiReaction } from "./emoji-reaction";

describe("EmojiReaction", () => {
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
