import type { ReactNode } from "react";

import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { ProductCard } from "./product-card";
import * as stories from "./product-card.stories";

const Stories = composeStories(stories);

const renderWithIntl = (ui: ReactNode) =>
  render(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {ui}
    </NextIntlClientProvider>,
  );

describe("ProductCard", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders name, counts, and link", async () => {
    await renderWithIntl(
      <ProductCard
        href={{ pathname: "/products/42" }}
        name="Fequest"
        requestCount={1234}
      />,
    );

    const link = document.querySelector<HTMLAnchorElement>("a");
    const text = document.body.textContent ?? "";

    expect(link?.getAttribute("href")).toBe("/products/42");
    expect(text).toContain("Fequest");
    expect(text).toContain(
      jaMessages.UI.productCard.requestCount.replace("{count}", "1,234"),
    );
  });

  it("falls back to an initial when logo is missing", async () => {
    await renderWithIntl(
      <ProductCard
        href={{ pathname: "/products/1" }}
        name="Sample"
        requestCount={5}
      />,
    );

    const fallback = document.querySelector<HTMLElement>(
      "[data-slot='product-card-fallback']",
    );

    expect(fallback?.textContent).toContain("S");
  });
});
