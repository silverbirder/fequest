import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Dashboard } from "./dashboard";

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
  it("shows product cards with counts", async () => {
    await render(
      <Dashboard
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
    await render(<Dashboard products={[]} />);

    const html = document.body.textContent ?? "";
    expect(html).toContain("まだプロダクトがありません");
    expect(html).toContain("プロダクトを作成");
  });
});
