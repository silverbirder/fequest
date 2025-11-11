import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { RequestCard } from "./request-card";

describe("RequestCard", () => {
  it("renders provided children", async () => {
    await render(<RequestCard>Child content</RequestCard>);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
