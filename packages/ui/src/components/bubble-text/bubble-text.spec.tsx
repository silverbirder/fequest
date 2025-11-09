import { render } from "vitest-browser-react";
import { describe, expect, it } from "vitest";

import { BubbleText } from "./bubble-text";

describe("BubbleText", () => {
  it("renders provided children", async () => {
    await render(<BubbleText className="sample">Child content</BubbleText>);

    const element = document.querySelector("div.sample");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
    expect(element?.classList.contains("sample")).toBe(true);
  });
});
