import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

describe("Avatar", () => {
  it("renders the avatar root with default styles", async () => {
    await render(
      <Avatar className="border">
        <AvatarImage
          alt="Sample"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
        />
        <AvatarFallback>SS</AvatarFallback>
      </Avatar>,
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
      <Avatar>
        <AvatarImage
          alt="Jane Doe"
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg=="
        />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
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
      <Avatar>
        <AvatarFallback className="font-semibold">AB</AvatarFallback>
      </Avatar>,
    );

    const fallback = document.querySelector<HTMLElement>(
      '[data-slot="avatar-fallback"]',
    );
    expect(fallback).not.toBeNull();
    expect(fallback?.textContent).toBe("AB");
    expect(fallback?.getAttribute("class") ?? "").toContain("font-semibold");
  });
});
