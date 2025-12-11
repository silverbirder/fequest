import { describe, expect, it } from "vitest";

import { formatCount, toIsoString } from "./index";

describe("toIsoString", () => {
  it("returns Japanese formatted string when given a Date", () => {
    const date = new Date(Date.UTC(2024, 4, 1, 12, 34, 56));

    expect(toIsoString(date)).toBe("2024年05月01日");
  });

  it("returns Japanese formatted string when given a parsable date string", () => {
    expect(toIsoString("2024-01-02T03:04:05Z")).toBe("2024年01月02日");
  });

  it("returns null when value is missing or invalid", () => {
    expect(toIsoString(undefined)).toBeNull();
    expect(toIsoString(null)).toBeNull();
    expect(toIsoString("not-a-date")).toBeNull();
  });
});

describe("formatCount", () => {
  it("formats numbers with Japanese locale separators", () => {
    expect(formatCount(1234567)).toBe("1,234,567");
  });

  it("keeps zero formatted", () => {
    expect(formatCount(0)).toBe("0");
  });
});
