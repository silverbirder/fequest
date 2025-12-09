import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Textarea } from "./textarea";
import * as stories from "./textarea.stories";

const Stories = composeStories(stories);

describe("Textarea", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders with base styles", async () => {
    await render(<Textarea placeholder="Notes" rows={4} />);

    const textareaEl = document.querySelector<HTMLTextAreaElement>(
      'textarea[data-slot="textarea"]',
    );
    expect(textareaEl).not.toBeNull();
    const className = textareaEl?.getAttribute("class") ?? "";
    expect(className).toContain("min-h-16");
    expect(className).toContain("rounded-md");
  });

  it("merges custom class names", async () => {
    await render(<Textarea className="bg-blue-50" rows={3} />);

    const textareaEl = document.querySelector<HTMLTextAreaElement>(
      'textarea[data-slot="textarea"]',
    );
    expect(textareaEl).not.toBeNull();
    expect(textareaEl?.className ?? "").toContain("bg-blue-50");
  });

  it("passes through native props", async () => {
    await render(
      <Textarea aria-invalid="true" defaultValue="Hello" rows={6} />,
    );

    const textareaEl = document.querySelector<HTMLTextAreaElement>(
      'textarea[data-slot="textarea"]',
    );
    expect(textareaEl).not.toBeNull();
    expect(textareaEl?.getAttribute("rows")).toBe("6");
    expect(textareaEl?.value).toBe("Hello");
    expect(textareaEl?.getAttribute("aria-invalid")).toBe("true");
  });

  it("applies display variant classes", async () => {
    await render(
      <Textarea readOnly rows={3} value="Static text" variant="display" />,
    );

    const textareaEl = document.querySelector<HTMLTextAreaElement>(
      'textarea[data-slot="textarea"]',
    );
    expect(textareaEl).not.toBeNull();
    const className = textareaEl?.className ?? "";
    expect(className).toContain("resize-none");
    expect(className).toContain("border-transparent");
    expect(className).toContain("shadow-none");
  });
});
