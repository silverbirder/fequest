import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Dashboard } from "./dashboard";

describe("Dashboard", () => {
  it("renders provided children", async () => {
    await render(<Dashboard>Child content</Dashboard>);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
