import { describe, expect, it } from "vitest";

import { getOpenFeatureRequestId } from "./get-open-feature-request-id";

describe("getOpenFeatureRequestId", () => {
  it("returns number when valid string is provided", () => {
    expect(getOpenFeatureRequestId({ open: "12" })).toBe(12);
  });

  it("uses first value when array is provided", () => {
    expect(getOpenFeatureRequestId({ open: ["5", "7"] })).toBe(5);
  });

  it("returns null for missing value", () => {
    expect(getOpenFeatureRequestId(undefined)).toBeNull();
    expect(getOpenFeatureRequestId({})).toBeNull();
  });

  it("returns null for non-numeric value", () => {
    expect(getOpenFeatureRequestId({ open: "abc" })).toBeNull();
  });

  it("returns null for non-positive numbers", () => {
    expect(getOpenFeatureRequestId({ open: "0" })).toBeNull();
    expect(getOpenFeatureRequestId({ open: "-3" })).toBeNull();
  });
});
