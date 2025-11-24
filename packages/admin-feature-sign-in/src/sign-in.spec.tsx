import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { SignIn } from "./sign-in";

describe("SignIn", () => {
  it("renders button and link", async () => {
    const action = vi.fn();
    await render(<SignIn onGoogleSignIn={action} />);

    const button = document.querySelector<HTMLButtonElement>("button");
    expect(button?.textContent).toContain("Googleで続行");
  });
});
