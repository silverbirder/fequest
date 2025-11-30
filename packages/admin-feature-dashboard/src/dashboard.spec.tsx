import { composeStories } from "@storybook/nextjs-vite";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Dashboard } from "./dashboard";
import * as stories from "./dashboard.stories";

const Stories = composeStories(stories);

vi.mock("next/link", () => {
  const Link = React.forwardRef<
    HTMLAnchorElement,
    { children: React.ReactNode; href: string }
  >(({ children, href, ...rest }, ref) => (
    <a href={href} ref={ref} {...rest}>
      {children}
    </a>
  ));

  Link.displayName = "MockNextLink";

  return { __esModule: true, default: Link };
});

describe("Dashboard", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = "";
  });

  it("shows product cards with counts", async () => {
    await render(
      <Dashboard
        onCreateProduct={vi.fn()}
        products={[
          { featureCount: 2, id: 1, name: "Alpha", reactionCount: 5 },
          { featureCount: 0, id: 2, name: "Beta", reactionCount: 0 },
        ]}
      />,
    );

    const html = document.body.textContent ?? "";
    expect(html).toContain("あなたのプロダクト");
    expect(html).toContain("Alpha");
    expect(html).toContain("質問: 2件");
    expect(html).toContain("リアクション: 5件");
    expect(html).toContain("Beta");
    expect(html).toContain("質問: 0件");
    expect(html).toContain("リアクション: 0件");
  });

  it("renders empty state when no products", async () => {
    await render(<Dashboard onCreateProduct={vi.fn()} products={[]} />);

    const html = document.body.textContent ?? "";
    expect(html).toContain("まだプロダクトがありません");
    expect(html).toContain("プロダクトを作成");
  });

  it("opens the create product dialog when the trigger is clicked", async () => {
    await render(<Dashboard onCreateProduct={vi.fn()} products={[]} />);

    const triggers = Array.from(document.querySelectorAll("button")).filter(
      (button) => button.textContent?.includes("プロダクトを作成"),
    );

    expect(triggers.length).toBeGreaterThan(0);

    triggers[0]?.click();

    await new Promise((resolve) => setTimeout(resolve, 0));

    const form = document.querySelector('[data-slot="create-product-form"]');
    expect(form).not.toBeNull();
    expect(form?.textContent).toContain("プロダクト名");
  });
});
