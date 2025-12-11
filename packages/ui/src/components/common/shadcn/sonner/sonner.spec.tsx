import { composeStories } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Toaster } from "./sonner";
import * as stories from "./sonner.stories";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}));

const Stories = composeStories(stories);

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

describe("Sonner", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    await Story.run();

    await expect(document.body).toMatchScreenshot();
  });

  it("renders a toast when triggered", async () => {
    render(<Toaster position="top-right" />);

    toast.success("Saved", { description: "Your changes have been stored." });

    await sleep(10);

    const toastEl = document.querySelector<HTMLElement>("[data-sonner-toast]");
    expect(toastEl).not.toBeNull();
    expect(toastEl?.textContent ?? "").toContain("Saved");

    const icon = toastEl?.querySelector<HTMLElement>("[data-icon]");
    expect(icon).not.toBeNull();
  });
});
