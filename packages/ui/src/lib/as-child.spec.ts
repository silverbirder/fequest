import { Slot } from "@radix-ui/react-slot";
import { describe, expect, it } from "vitest";

import { resolveSlotComponent } from "./as-child";

describe("resolveSlotComponent", () => {
  it("returns default component when asChild is false", () => {
    expect(resolveSlotComponent(false, "div")).toBe("div");
  });

  it("returns Slot when asChild is true", () => {
    expect(resolveSlotComponent(true, "div")).toBe(Slot);
  });
});
