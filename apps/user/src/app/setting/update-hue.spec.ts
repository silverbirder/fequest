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

import { createUpdateHueBase } from "./update-hue";

const createFormData = (hueBase: string) => {
  const formData = new FormData();
  formData.set("hueBase", hueBase);
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReset();
  mocks.cookies.mockReset();
  mocks.redirect.mockReset();
  mocks.setCookie.mockReset();
});

describe("createUpdateHueBase", () => {
  it("redirects when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValueOnce(null);
    mocks.cookies.mockReturnValue({ set: mocks.setCookie });
    const action = createUpdateHueBase();

    await action(createFormData("238"));

    expect(mocks.redirect).toHaveBeenCalledWith("/");
    expect(mocks.setCookie).not.toHaveBeenCalled();
  });

  it("throws when the hue base is invalid", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mocks.cookies.mockReturnValue({ set: mocks.setCookie });
    const action = createUpdateHueBase();

    await expect(action(createFormData("500"))).rejects.toThrow(
      "Invalid hue base value",
    );

    expect(mocks.setCookie).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("sets the hue base cookie and redirects", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mocks.cookies.mockReturnValue({ set: mocks.setCookie });
    const action = createUpdateHueBase();

    await action(createFormData("180"));

    expect(mocks.setCookie).toHaveBeenCalledWith(
      expect.objectContaining({
        maxAge: 60 * 60 * 24 * 365,
        name: "user-hue-base",
        path: "/",
        sameSite: "lax",
        value: "180",
      }),
    );
    expect(mocks.redirect).toHaveBeenCalledWith("/setting");
  });
});
