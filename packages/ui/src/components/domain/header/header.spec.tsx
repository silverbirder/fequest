import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Header } from "./header";
import * as stories from "./header.stories";

const Stories = composeStories(stories);

describe("Header", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("shows login action when the user is not authenticated", async () => {
    await render(
      <Header
        loginAction={async () => {}}
        logoutAction={async () => {}}
        user={null}
      />,
    );

    const form = document.querySelector("form");
    const button = form?.querySelector<HTMLButtonElement>("button");

    expect(form).not.toBeNull();
    expect(button?.textContent).toContain("ログイン");
  });

  it("keeps the header sticky at the top", async () => {
    await render(
      <Header
        loginAction={async () => {}}
        logoutAction={async () => {}}
        user={null}
      />,
    );

    const header = document.querySelector<HTMLElement>(
      "header[data-slot='stack']",
    );

    expect(header?.className).toContain("sticky");
    expect(header?.className).toContain("top-0");
  });

  it("uses provided login action when given", async () => {
    const loginAction = async () => {};
    const logoutAction = async () => {};

    await render(
      <Header
        loginAction={loginAction}
        logoutAction={logoutAction}
        user={null}
      />,
    );

    const form = document.querySelector("form");
    expect(form).not.toBeNull();
  });

  it("renders an avatar when the user is authenticated", async () => {
    await render(
      <Header
        loginAction={async () => {}}
        logoutAction={async () => {}}
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

  it("opens dropdown menu on avatar click and shows logout", async () => {
    await render(
      <Header
        appendLink={{
          href: "https://admin.fequest.local",
          label: "管理ページへ",
        }}
        loginAction={async () => {}}
        logoutAction={async () => {}}
        user={{
          image: null,
          name: "Fequest User",
        }}
      />,
    );

    const trigger = document.querySelector<HTMLElement>(
      "[data-slot='dropdown-menu-trigger']",
    );

    trigger?.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    trigger?.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        button: 0,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    trigger?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, button: 0 }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const menu = document.querySelector<HTMLElement>(
      "[data-slot='dropdown-menu-content']",
    );

    expect(menu?.textContent ?? "").toContain("ログアウト");
  });

  it("shows a cross-portal link when provided", async () => {
    const href = "https://admin.fequest.local";

    await render(
      <Header
        appendLink={{
          href,
          label: "管理ページへ",
        }}
        loginAction={async () => {}}
        logoutAction={async () => {}}
        user={{
          image: null,
          name: "Fequest User",
        }}
      />,
    );

    const trigger = document.querySelector<HTMLElement>(
      "[data-slot='dropdown-menu-trigger']",
    );

    trigger?.dispatchEvent(
      new PointerEvent("pointerdown", {
        bubbles: true,
        button: 0,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    trigger?.dispatchEvent(
      new PointerEvent("pointerup", {
        bubbles: true,
        button: 0,
        pointerId: 1,
        pointerType: "mouse",
      }),
    );
    trigger?.dispatchEvent(
      new MouseEvent("click", { bubbles: true, button: 0 }),
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));

    const menu = document.querySelector<HTMLElement>(
      "[data-slot='dropdown-menu-content']",
    );
    const switchAnchor = menu?.querySelector<HTMLAnchorElement>(
      `a[href='${href}']`,
    );

    expect(menu?.textContent ?? "").toContain("管理ページへ");
    expect(switchAnchor).not.toBeNull();
  });
});
