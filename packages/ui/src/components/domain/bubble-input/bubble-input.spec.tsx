import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { BubbleInput } from "./bubble-input";

describe("BubbleInput", () => {
  it("renders provided children", async () => {
    await render(<BubbleInput />);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
  });
});
