import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { SignIn } from "./sign-in";

describe("SignIn", () => {
  it("renders provided children", async () => {
    await render(<SignIn>Child content</SignIn>);

    const element = document.querySelector("div");
    expect(element).not.toBeNull();
    expect(element?.textContent ?? "").toContain("Child content");
  });
});
