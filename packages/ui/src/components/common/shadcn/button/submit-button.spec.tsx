import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import * as stories from "./submit-button.stories";

const Stories = composeStories(stories);

describe("SubmitButton", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("defaults to submit type and respects pending label", async () => {
    await render(
      <form action={async () => {}}>
        <Stories.Default />
      </form>,
    );

    const buttonEl = document.querySelector<HTMLButtonElement>(
      'button[data-slot="button"]',
    );
    expect(buttonEl?.getAttribute("type")).toBe("submit");
  });
});
