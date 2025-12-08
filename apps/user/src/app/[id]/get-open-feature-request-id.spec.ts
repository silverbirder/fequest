import { describe, expect, it } from "vitest";

import { getOpenFeatureRequestId } from "./get-open-feature-request-id";

describe("getOpenFeatureRequestId", () => {
  it("parses valid id", () => {
    expect(getOpenFeatureRequestId({ open: "12" })).toBe(12);
    expect(getOpenFeatureRequestId({ open: ["5", "7"] })).toBe(5);
  });

  it("returns null when missing or invalid", () => {
    expect(getOpenFeatureRequestId(undefined)).toBeNull();
    expect(getOpenFeatureRequestId({})).toBeNull();
    expect(getOpenFeatureRequestId({ open: "abc" })).toBeNull();
    expect(getOpenFeatureRequestId({ open: "0" })).toBeNull();
    expect(getOpenFeatureRequestId({ open: "-3" })).toBeNull();
  });
});
