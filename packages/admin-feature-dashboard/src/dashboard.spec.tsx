import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Dashboard } from "./dashboard";
import * as stories from "./dashboard.stories";

const Stories = composeStories(stories);

const renderWithIntl = (ui: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {ui}
    </NextIntlClientProvider>,
  );

vi.mock("next/link", () => {
  const Link = React.forwardRef<
    HTMLAnchorElement,
    { children: React.ReactNode; href: string | { pathname: string } }
  >(({ children, href, ...rest }, ref) => (
    <a
      href={typeof href === "string" ? href : href.pathname}
      ref={ref}
      {...rest}
    >
      {children}
    </a>
  ));

  Link.displayName = "MockNextLink";

  return { __esModule: true, default: Link };
});

describe("Dashboard", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("shows product cards with counts", async () => {
    await renderWithIntl(
      <Dashboard
        onCreateProduct={vi.fn()}
        products={[
          { featureCount: 2, id: 1, name: "Alpha", reactionCount: 5 },
          { featureCount: 0, id: 2, name: "Beta", reactionCount: 0 },
        ]}
      />,
    );

    const html = document.body.textContent ?? "";
    expect(html).toContain(jaMessages.AdminDashboard.list.title);
    expect(html).toContain("Alpha");
    expect(html).toContain("リクエスト 2件");
    expect(html).toContain("Beta");
    expect(html).toContain("リクエスト 0件");
  });

  it("renders empty state when no products", async () => {
    await renderWithIntl(<Dashboard onCreateProduct={vi.fn()} products={[]} />);

    const html = document.body.textContent ?? "";
    expect(html).toContain(jaMessages.AdminDashboard.empty.title);
    expect(html).toContain(jaMessages.AdminDashboard.buttons.createProduct);
  });

  it("opens the create product dialog when the trigger is clicked", async () => {
    await renderWithIntl(<Dashboard onCreateProduct={vi.fn()} products={[]} />);

    const triggers = Array.from(document.querySelectorAll("button")).filter(
      (button) =>
        button.textContent?.includes(
          jaMessages.AdminDashboard.buttons.createProduct,
        ),
    );

    expect(triggers.length).toBeGreaterThan(0);

    triggers[0]?.click();

    await new Promise((resolve) => setTimeout(resolve, 0));

    const form = document.querySelector('[data-slot="create-product-form"]');
    expect(form).not.toBeNull();
    expect(form?.textContent).toContain(
      jaMessages.AdminDashboard.dialog.nameLabel,
    );
  });
});
