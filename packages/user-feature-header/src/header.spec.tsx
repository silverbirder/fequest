import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Header } from "./header";

describe("Header", () => {
  it("renders provided children", async () => {
    await render(<Header>Child content</Header>);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
