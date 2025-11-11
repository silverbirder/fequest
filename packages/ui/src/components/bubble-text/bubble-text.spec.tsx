import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { BubbleText } from "./bubble-text";

describe("BubbleText", () => {
  it("renders provided children", async () => {
    await render(<BubbleText>Child content</BubbleText>);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
