import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

vi.mock("next-mdx-remote-client/rsc", () => ({
  MDXRemote: (props: { source: string }) => (
    <div data-testid="mdx-remote">{props.source}</div>
  ),
}));

import { MdxContent } from "./mdx-content";

describe("MdxContent", () => {
  it("renders provided MDX source", async () => {
    await render(<MdxContent source="# Hello" />);

    const content = document.querySelector<HTMLElement>(
      "[data-testid='mdx-remote']",
    );
    expect(content?.textContent).toContain("# Hello");
  });
});
