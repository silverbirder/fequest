import { safeParse } from "valibot";
import { describe, expect, it } from "vitest";

import { idSchema } from "./base";

const invalidMessage = "Invalid ID";

describe("idSchema", () => {
  it("parses a numeric string into an integer", () => {
    const result = safeParse(idSchema, "42");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe(42);
    }
  });

  it("rejects non-numeric strings", () => {
    const result = safeParse(idSchema, "abc");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe(invalidMessage);
    }
  });

  it("rejects integers less than one", () => {
    for (const input of ["0", "-1"]) {
      const result = safeParse(idSchema, input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.issues[0]?.message).toBe(invalidMessage);
      }
    }
  });

  it("rejects decimal values", () => {
    const result = safeParse(idSchema, "3.14");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe(invalidMessage);
    }
  });
});
