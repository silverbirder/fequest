import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import * as stories from "./alert-dialog.stories";

const Stories = composeStories(stories);

describe("AlertDialog", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders the overlay and slots when open", async () => {
    await render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove item?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The selected item will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const overlay = document.querySelector<HTMLElement>(
      '[data-slot="alert-dialog-overlay"]',
    );
    expect(overlay).not.toBeNull();
    const overlayClass = overlay?.getAttribute("class") ?? "";
    expect(overlayClass).toContain("bg-black/50");
    expect(overlayClass).toContain("fixed inset-0");

    const content = document.querySelector<HTMLElement>(
      '[data-slot="alert-dialog-content"]',
    );
    expect(content).not.toBeNull();
    const contentClass = content?.getAttribute("class") ?? "";
    expect(contentClass).toContain("rounded-lg");
    expect(contentClass).toContain("p-6");

    const header = document.querySelector<HTMLElement>(
      '[data-slot="alert-dialog-header"]',
    );
    expect(header).not.toBeNull();
    expect(header?.className ?? "").toContain("flex flex-col");

    const title = document.querySelector<HTMLElement>(
      '[data-slot="alert-dialog-title"]',
    );
    expect(title?.textContent).toBe("Remove item?");

    const description = document.querySelector<HTMLElement>(
      '[data-slot="alert-dialog-description"]',
    );
    expect(description?.textContent).toContain("permanently deleted");
  });

  it("applies button variants and merges custom class names", async () => {
    await render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogFooter>
            <AlertDialogCancel className="custom-cancel">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="custom-action">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const footer = document.querySelector<HTMLElement>(
      '[data-slot="alert-dialog-footer"]',
    );
    expect(footer).not.toBeNull();
    expect(footer?.className ?? "").toContain("flex-col-reverse");

    const buttons = Array.from(footer?.querySelectorAll("button") ?? []);
    expect(buttons).toHaveLength(2);

    const cancelButton = buttons[0];
    expect(cancelButton?.textContent).toBe("Cancel");
    const cancelClass = cancelButton?.className ?? "";
    expect(cancelClass).toContain("custom-cancel");
    expect(cancelClass).toContain("border");

    const actionButton = buttons[1];
    expect(actionButton?.textContent).toBe("Confirm");
    const actionClass = actionButton?.className ?? "";
    expect(actionClass).toContain("custom-action");
    expect(actionClass).toContain("inline-flex");
  });
});
