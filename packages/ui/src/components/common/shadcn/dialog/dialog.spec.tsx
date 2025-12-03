import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import * as stories from "./dialog.stories";

const Stories = composeStories(stories);

describe("Dialog", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders the overlay and content when open", async () => {
    await render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button type="button">Confirm</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const overlay = document.querySelector<HTMLElement>(
      '[data-slot="dialog-overlay"]',
    );
    expect(overlay).not.toBeNull();
    expect(overlay?.getAttribute("class") ?? "").toContain("bg-black/50");

    const content = document.querySelector<HTMLElement>(
      '[data-slot="dialog-content"]',
    );
    expect(content).not.toBeNull();
    const className = content?.getAttribute("class") ?? "";
    expect(className).toContain("rounded-lg");
    expect(className).toContain("p-6");

    const title = document.querySelector<HTMLElement>(
      '[data-slot="dialog-title"]',
    );
    expect(title?.textContent).toBe("Dialog Title");

    const description = document.querySelector<HTMLElement>(
      '[data-slot="dialog-description"]',
    );
    expect(description?.textContent).toBe("Dialog Description");
  });

  it("shows the default close button", async () => {
    await render(
      <Dialog open>
        <DialogContent>
          <p>Body content</p>
        </DialogContent>
      </Dialog>,
    );

    const closeButton = document.querySelector<HTMLButtonElement>(
      'button[data-slot="dialog-close"]',
    );
    expect(closeButton).not.toBeNull();
    expect(closeButton?.className ?? "").toContain("absolute top-4 right-4");
    expect(
      closeButton?.querySelector<HTMLSpanElement>("span")?.textContent,
    ).toBe("Close");
  });

  it("allows custom close controls when the default is hidden", async () => {
    await render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogFooter>
            <DialogClose asChild>
              <button className="custom-close" type="button">
                Dismiss
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );

    const closeButtons = document.querySelectorAll(
      '[data-slot="dialog-close"]',
    );
    expect(closeButtons).toHaveLength(1);
    expect((closeButtons[0] as HTMLButtonElement)?.className ?? "").toContain(
      "custom-close",
    );
  });
});
