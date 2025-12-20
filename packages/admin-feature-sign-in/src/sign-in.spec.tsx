import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { SignIn } from "./sign-in";
import * as stories from "./sign-in.stories";

const Stories = composeStories(stories);

describe("SignIn", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders button and link", async () => {
    const action = vi.fn();
    await render(
      <NextIntlClientProvider locale="ja" messages={jaMessages}>
        <SignIn onGoogleSignIn={action} />
      </NextIntlClientProvider>,
    );

    const button = document.querySelector<HTMLButtonElement>("button");
    expect(button?.textContent).toContain(jaMessages.AdminSignIn.googleButton);
  });
});
