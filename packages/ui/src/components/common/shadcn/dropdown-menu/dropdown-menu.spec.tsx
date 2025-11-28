import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";

describe("DropdownMenu", () => {
  it("renders the content and menu items when open", async () => {
    await render(
      <DropdownMenu open>
        <DropdownMenuTrigger asChild>
          <button type="button">Open</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem inset>Billing</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const content = document.querySelector<HTMLElement>(
      '[data-slot="dropdown-menu-content"]',
    );
    expect(content).not.toBeNull();
    const className = content?.getAttribute("class") ?? "";
    expect(className).toContain("rounded-md");
    expect(className).toContain("shadow-md");

    const items = document.querySelectorAll('[data-slot="dropdown-menu-item"]');
    expect(items).toHaveLength(2);
    expect(items[1]?.getAttribute("data-inset")).toBe("true");

    const label = document.querySelector('[data-slot="dropdown-menu-label"]');
    expect(label?.textContent).toBe("Quick Actions");
  });

  it("shows checkbox state and shortcut text", async () => {
    await render(
      <DropdownMenu open>
        <DropdownMenuTrigger asChild>
          <button type="button">Open</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>
            Enable alerts
          </DropdownMenuCheckboxItem>
          <DropdownMenuItem inset>
            Preferences
            <DropdownMenuShortcut>Cmd+P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const checkbox = document.querySelector<HTMLElement>(
      '[data-slot="dropdown-menu-checkbox-item"]',
    );
    expect(checkbox).not.toBeNull();
    expect(checkbox?.getAttribute("data-state")).toBe("checked");

    const indicator = checkbox?.querySelector("svg");
    expect(indicator).not.toBeNull();

    const shortcut = document.querySelector<HTMLElement>(
      '[data-slot="dropdown-menu-shortcut"]',
    );
    expect(shortcut?.textContent).toBe("Cmd+P");
    expect(shortcut?.className ?? "").toContain("text-xs");
  });
});
