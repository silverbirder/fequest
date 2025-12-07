import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Image } from "./image";
import * as stories from "./image.stories";

const Stories = composeStories(stories);

describe("Image", () => {
  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders with alt text and dimensions", async () => {
    await render(
      <Image
        alt="Test Logo"
        height={64}
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
        width={64}
      />,
    );

    const img = document.querySelector("img[data-slot='image']");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("alt")).toBe("Test Logo");
    expect(img?.getAttribute("width")).toBe("64");
    expect(img?.getAttribute("height")).toBe("64");
  });
});
