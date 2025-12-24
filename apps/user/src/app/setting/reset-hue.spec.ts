import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  cookies: vi.fn(),
  redirect: vi.fn(),
  setCookie: vi.fn(),
}));

vi.mock("~/server/auth", () => ({
  auth: mocks.auth,
}));

vi.mock("next/headers", () => ({
  cookies: mocks.cookies,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createResetHueBase } from "./reset-hue";

afterEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReset();
  mocks.cookies.mockReset();
  mocks.redirect.mockReset();
  mocks.setCookie.mockReset();
});

describe("createResetHueBase", () => {
  it("redirects when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValueOnce(null);
    mocks.cookies.mockReturnValue({ set: mocks.setCookie });
    const action = createResetHueBase();

    await action();

    expect(mocks.redirect).toHaveBeenCalledWith("/");
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });

  it("clears the hue base cookie and redirects", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mocks.cookies.mockReturnValue({ set: mocks.setCookie });
    const action = createResetHueBase();

    await action();

    expect(mocks.setCookie).toHaveBeenCalledWith(
      expect.objectContaining({
        maxAge: 0,
        name: "user-hue-base",
        path: "/",
        sameSite: "lax",
        value: "",
      }),
    );
    expect(mocks.redirect).toHaveBeenCalledWith("/setting");
  });
});
