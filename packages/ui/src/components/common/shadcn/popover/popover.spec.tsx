import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import * as stories from "./popover.stories";

const Stories = composeStories(stories);

describe("Popover", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = "";
  });

  it("renders content when open and trigger is present", async () => {
    await render(
      <Popover open>
        <PopoverTrigger asChild>
          <button type="button">Open</button>
        </PopoverTrigger>
        <PopoverContent>
          <div data-slot="popover-content">Hello Popover</div>
        </PopoverContent>
      </Popover>,
    );

    const content = document.querySelector<HTMLElement>(
      '[data-slot="popover-content"]',
    );
    expect(content).not.toBeNull();
    expect(content?.textContent).toBe("Hello Popover");
  });

  it("renders trigger when provided as child", async () => {
    await render(
      <Popover>
        <PopoverTrigger asChild>
          <button type="button">Trigger</button>
        </PopoverTrigger>
        <PopoverContent />
      </Popover>,
    );

    const trigger = document.querySelector<HTMLButtonElement>(
      'button[data-slot="popover-trigger"]',
    );

    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toBe("Trigger");
  });
});
