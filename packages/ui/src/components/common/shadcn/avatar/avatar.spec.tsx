import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Avatar, AvatarFallback, AvatarImage, AvatarRoot } from "./avatar";
import * as stories from "./avatar.stories";

const Stories = composeStories(stories);

describe("Avatar", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders the avatar root with default styles", async () => {
    await render(
      <AvatarRoot className="border">
        <AvatarImage
          alt="Sample"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
        />
        <AvatarFallback>SS</AvatarFallback>
      </AvatarRoot>,
    );

    const avatar = document.querySelector<HTMLElement>('[data-slot="avatar"]');
    expect(avatar).not.toBeNull();
    const className = avatar?.getAttribute("class") ?? "";
    expect(className).toContain("rounded-full");
    expect(className).toContain("size-8");
    expect(className).toContain("border");
  });

  it("renders the image and applies sizing classes", async () => {
    await render(
      <AvatarRoot>
        <AvatarImage
          alt="Jane Doe"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
        />
        <AvatarFallback>JD</AvatarFallback>
      </AvatarRoot>,
    );

    await expect
      .poll(() => document.querySelector('[data-slot="avatar-image"]'))
      .not.toBeNull();

    const image = document.querySelector<HTMLImageElement>(
      '[data-slot="avatar-image"]',
    );
    expect(image?.getAttribute("class") ?? "").toContain("size-full");
    expect(image?.getAttribute("alt")).toBe("Jane Doe");
  });

  it("shows the fallback content", async () => {
    await render(
      <AvatarRoot>
        <AvatarFallback className="font-semibold">AB</AvatarFallback>
      </AvatarRoot>,
    );

    const fallback = document.querySelector<HTMLElement>(
      '[data-slot="avatar-fallback"]',
    );
    expect(fallback).not.toBeNull();
    expect(fallback?.textContent).toBe("AB");
    expect(fallback?.getAttribute("class") ?? "").toContain("font-semibold");
  });

  it("derives fallback initials from name when src is missing", async () => {
    await render(<Avatar name="Jane Doe" src={undefined} />);

    const fallback = document.querySelector<HTMLElement>(
      '[data-slot="avatar-fallback"]',
    );
    expect(fallback?.textContent).toBe("JD");
  });

  it("prefers explicit fallback text over derived initials", async () => {
    await render(<Avatar fallbackText="ZZ" name="John Doe" src={undefined} />);

    const fallback = document.querySelector<HTMLElement>(
      '[data-slot="avatar-fallback"]',
    );
    expect(fallback?.textContent).toBe("ZZ");
  });
});
