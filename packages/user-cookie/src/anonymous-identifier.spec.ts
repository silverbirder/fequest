import { describe, expect, it, vi } from "vitest";

import type { CookieStoreLike } from "./cookie-store";

import {
  ANONYMOUS_IDENTIFIER_COOKIE_NAME,
  ensureAnonymousIdentifier,
  getAnonymousIdentifierFromHeaders,
} from "./anonymous-identifier";

const createCookieStore = (
  initialValue?: string,
): CookieStoreLike & { setCalls: unknown[] } => {
  let storedValue = initialValue;
  const setCalls: unknown[] = [];

  return {
    get: vi.fn(() => (storedValue ? { value: storedValue } : undefined)),
    set: vi.fn((options) => {
      storedValue = options.value;
      setCalls.push(options);
    }),
    setCalls,
  };
};

describe("ensureAnonymousIdentifier", () => {
  it("returns existing identifier without setting a new cookie", () => {
    const cookieStore = createCookieStore("anon-xyz");

    const value = ensureAnonymousIdentifier(cookieStore);

    expect(value).toBe("anon-xyz");
    expect(cookieStore.set).not.toHaveBeenCalled();
  });

  it("generates and stores an identifier when missing", () => {
    const cookieStore = createCookieStore();
    const fakeUuid = "12345678-1234-1234-1234-1234567890ab";
    const uuidSpy = vi.spyOn(crypto, "randomUUID").mockReturnValue(fakeUuid);

    try {
      const value = ensureAnonymousIdentifier(cookieStore, {
        secure: true,
      });
      expect(value).toBe(fakeUuid);
      expect(cookieStore.set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: ANONYMOUS_IDENTIFIER_COOKIE_NAME,
          secure: true,
          value: fakeUuid,
        }),
      );
    } finally {
      uuidSpy.mockRestore();
    }
  });
});

describe("getAnonymousIdentifierFromHeaders", () => {
  it("returns the cookie value when present", () => {
    const headers = new Headers({
      cookie: `${ANONYMOUS_IDENTIFIER_COOKIE_NAME}=anon-123`,
    });

    expect(getAnonymousIdentifierFromHeaders(headers)).toBe("anon-123");
  });

  it("returns null when the cookie is missing", () => {
    const headers = new Headers();

    expect(getAnonymousIdentifierFromHeaders(headers)).toBeNull();
  });
});
