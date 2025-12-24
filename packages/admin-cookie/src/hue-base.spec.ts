import { describe, expect, it, vi } from "vitest";

import type { CookieStoreLike } from "./cookie-store";

import {
  clearHueBaseCookie,
  DEFAULT_HUE_BASE,
  getHueBaseFromCookieStore,
  parseHueBase,
  setHueBaseCookie,
  toHueBaseCss,
} from "./hue-base";

describe("parseHueBase", () => {
  it("parses valid integer values within range", () => {
    expect(parseHueBase("0")).toBe(0);
    expect(parseHueBase("238")).toBe(238);
    expect(parseHueBase("360")).toBe(360);
  });

  it("rejects non-integers and out-of-range values", () => {
    expect(parseHueBase("")).toBeNull();
    expect(parseHueBase("180.5")).toBeNull();
    expect(parseHueBase("-1")).toBeNull();
    expect(parseHueBase("361")).toBeNull();
    expect(parseHueBase("abc")).toBeNull();
  });
});

describe("toHueBaseCss", () => {
  it("returns a degree value string", () => {
    expect(toHueBaseCss(238)).toBe("238deg");
  });
});

describe("getHueBaseFromCookieStore", () => {
  it("returns the parsed value when present", () => {
    const cookieStore: CookieStoreLike = {
      get: () => ({ value: "120" }),
      set: vi.fn(),
    };

    expect(getHueBaseFromCookieStore(cookieStore)).toBe(120);
  });

  it("returns the default when invalid or missing", () => {
    const cookieStore: CookieStoreLike = {
      get: () => ({ value: "invalid" }),
      set: vi.fn(),
    };

    expect(getHueBaseFromCookieStore(cookieStore)).toBe(DEFAULT_HUE_BASE);
  });
});

describe("setHueBaseCookie", () => {
  it("sets the cookie with defaults", () => {
    const cookieStore: CookieStoreLike = {
      get: vi.fn(),
      set: vi.fn(),
    };

    setHueBaseCookie(cookieStore, 180);

    expect(cookieStore.set).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "admin-hue-base",
        path: "/",
        sameSite: "lax",
        value: "180",
      }),
    );
  });
});

describe("clearHueBaseCookie", () => {
  it("clears the cookie with defaults", () => {
    const cookieStore: CookieStoreLike = {
      get: vi.fn(),
      set: vi.fn(),
    };

    clearHueBaseCookie(cookieStore);

    expect(cookieStore.set).toHaveBeenCalledWith(
      expect.objectContaining({
        maxAge: 0,
        name: "admin-hue-base",
        path: "/",
        sameSite: "lax",
        value: "",
      }),
    );
  });
});
