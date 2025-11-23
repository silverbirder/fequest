import { afterEach, describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Header } from "./header";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Header", () => {
  it("shows login action when the user is not authenticated", async () => {
    await render(<Header loginAction={async () => {}} user={null} />);

    const form = document.querySelector("form");
    const button = form?.querySelector<HTMLButtonElement>("button");

    expect(form).not.toBeNull();
    expect(button?.textContent).toContain("ログイン");
  });

  it("uses provided login action when given", async () => {
    const loginAction = async () => {};

    await render(<Header loginAction={loginAction} user={null} />);

    const form = document.querySelector("form");
    expect(form).not.toBeNull();
  });

  it("renders an avatar when the user is authenticated", async () => {
    await render(
      <Header
        loginAction={async () => {}}
        user={{
          image: "https://example.com/avatar.png",
          name: "田中 太郎",
        }}
      />,
    );

    const avatarFallback = document.querySelector<HTMLElement>(
      "[data-slot='avatar'] [data-slot='avatar-fallback']",
    );

    expect(avatarFallback?.textContent).toBe("田太");
    expect(document.body.textContent).not.toContain("ログイン");
  });
});
