import { jaMessages } from "@repo/messages";
import { composeStories } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { ComponentProps, PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { EmojiPicker } from "./emoji-picker";
import * as stories from "./emoji-picker.stories";

const Stories = composeStories(stories);

const renderWithIntl = (ui: React.ReactNode) =>
  render(
    <NextIntlClientProvider locale="ja" messages={jaMessages}>
      {ui}
    </NextIntlClientProvider>,
  );

vi.mock("../../common/shadcn", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
  Popover: ({ children }: PropsWithChildren) => (
    <div data-testid="mock-popover">{children}</div>
  ),
  PopoverContent: ({ children }: PropsWithChildren) => (
    <div data-testid="mock-content">{children}</div>
  ),
  PopoverTrigger: ({ children }: PropsWithChildren) => <>{children}</>,
}));

vi.mock("@emoji-mart/react", () => ({
  __esModule: true,
  default: ({ onEmojiSelect }: { onEmojiSelect: (emoji: unknown) => void }) => (
    <button
      data-testid="mock-picker"
      onClick={() => onEmojiSelect({ native: "😄" })}
      type="button"
    >
      pick
    </button>
  ),
}));

vi.mock("@emoji-mart/data", () => ({
  __esModule: true,
  default: {},
}));

describe("EmojiPicker", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("invokes onSelect with chosen emoji", async () => {
    const handleSelect = vi.fn();
    await renderWithIntl(<EmojiPicker onSelect={handleSelect} />);

    const trigger =
      document.querySelector<HTMLButtonElement>("button[aria-label]");
    expect(trigger).not.toBeNull();

    trigger?.click();

    const pickerButton = document.querySelector<HTMLButtonElement>(
      "[data-testid='mock-picker']",
    );
    expect(pickerButton).not.toBeNull();

    pickerButton?.click();

    expect(handleSelect).toHaveBeenCalledWith("😄");
  });
});
