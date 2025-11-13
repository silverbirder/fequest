import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Input } from "./input";

describe("Input", () => {
  it("renders with base styles", async () => {
    await render(<Input placeholder="Your name" type="text" />);

    const inputEl = document.querySelector<HTMLInputElement>(
      'input[data-slot="input"]',
    );
    expect(inputEl).not.toBeNull();
    const className = inputEl?.getAttribute("class") ?? "";
    expect(className).toContain("h-9");
    expect(className).toContain("rounded-md");
  });

  it("merges custom class names", async () => {
    await render(<Input className="bg-red-500" type="email" />);

    const inputEl = document.querySelector<HTMLInputElement>(
      'input[data-slot="input"]',
    );
    expect(inputEl).not.toBeNull();
    expect(inputEl?.className ?? "").toContain("bg-red-500");
  });

  it("passes through native props", async () => {
    await render(<Input defaultValue="test@example.com" type="email" />);

    const inputEl = document.querySelector<HTMLInputElement>(
      'input[data-slot="input"]',
    );
    expect(inputEl).not.toBeNull();
    expect(inputEl?.getAttribute("type")).toBe("email");
    expect(inputEl?.value).toBe("test@example.com");
  });
});
