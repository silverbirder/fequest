import type { ReactNode } from "react";

import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { ProductLogo } from "./product-logo";
import * as stories from "./product-logo.stories";

const Stories = composeStories(stories);

const renderWithIntl = (ui: ReactNode) =>
  render(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {ui}
    </NextIntlClientProvider>,
  );

describe("ProductLogo", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders fallback initial when logo is missing", async () => {
    await renderWithIntl(<ProductLogo logoUrl={null} name="Sample" />);

    const fallback = document.querySelector<HTMLElement>(
      "[data-slot='product-logo-fallback']",
    );

    expect(fallback?.textContent).toContain("S");
  });

  it("uses provided logo url", async () => {
    await renderWithIntl(
      <ProductLogo logoUrl="https://placehold.co/120x120" name="Sample" />,
    );

    const image = document.querySelector<HTMLImageElement>("img");

    expect(image?.getAttribute("src")).toContain("placehold.co");
  });
});
