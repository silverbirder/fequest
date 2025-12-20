import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Top } from "./top";
import * as stories from "./top.stories";

const Stories = composeStories(stories);

describe("Top", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders each product with counts and link", async () => {
    const adminDomain = "https://admin.example.com";

    await render(
      <NextIntlClientProvider locale="ja" messages={jaMessages}>
        <Top
          adminDomain={adminDomain}
          products={[
            { featureCount: 2, id: 1, name: "First", reactionCount: 3 },
            { featureCount: 0, id: 2, name: "Second", reactionCount: 0 },
          ]}
        />
      </NextIntlClientProvider>,
    );

    const text = document.body.textContent ?? "";
    expect(text).toContain(jaMessages.UserFeatureTop.appName);
    expect(text).toContain(jaMessages.UserFeatureTop.hero.tagline);
    expect(text).toContain(
      [
        jaMessages.UserFeatureTop.hero.description.prefix,
        jaMessages.UserFeatureTop.hero.description.want,
        jaMessages.UserFeatureTop.hero.description.middle,
        jaMessages.UserFeatureTop.hero.description.build,
        jaMessages.UserFeatureTop.hero.description.suffix,
      ].join(""),
    );
    expect(text).toContain(jaMessages.UserFeatureTop.sections.adminLinkLabel);
    expect(text).toContain("First");
    expect(text).toContain("リクエスト 2件");
    expect(text).toContain("Second");
    expect(text).toContain("リクエスト 0件");

    const links = Array.from(document.querySelectorAll("a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(links).toContain(adminDomain);
    expect(links).toContain("/1");
    expect(links).toContain("/2");
  });
});
