import { ComponentProps, PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { EmojiPicker } from "./emoji-picker";

vi.mock("../../shadcn", () => ({
  Button: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
  DropdownMenu: ({ children }: PropsWithChildren) => (
    <div data-testid="mock-dropdown">{children}</div>
  ),
  DropdownMenuContent: ({ children }: PropsWithChildren) => (
    <div data-testid="mock-content">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: PropsWithChildren) => <>{children}</>,
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
  it("invokes onSelect with chosen emoji", async () => {
    const handleSelect = vi.fn();
    await render(<EmojiPicker onSelect={handleSelect} />);

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
