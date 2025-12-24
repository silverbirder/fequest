import type { ReactNode } from "react";

import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Footer } from "./footer";
import * as stories from "./footer.stories";

const Stories = composeStories(stories);

const renderWithIntl = (ui: ReactNode) =>
  render(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {ui}
    </NextIntlClientProvider>,
  );

describe("Footer", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders footer links and credit", async () => {
    await renderWithIntl(
      <Footer
        featureRequestHref="https://fequest.vercel.app/8"
        inquiryHref="https://forms.gle/G25K58MVsSWit75n9"
        servicesHref="https://sites.google.com/view/silverbirders-services"
      />,
    );

    const anchors = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a"),
    );
    const inquiryLink = anchors.find((anchor) =>
      anchor.textContent?.includes(jaMessages.UI.footer.inquiry),
    );
    const servicesLink = anchors.find((anchor) =>
      anchor.textContent?.includes(jaMessages.UI.footer.services),
    );
    const featureRequestLink = anchors.find((anchor) =>
      anchor.textContent?.includes(jaMessages.UI.footer.featureRequest),
    );

    expect(inquiryLink).not.toBeNull();
    expect(servicesLink).not.toBeNull();
    expect(featureRequestLink).not.toBeNull();
    expect(document.body.textContent).toContain(jaMessages.UI.footer.credit);
  });
});
