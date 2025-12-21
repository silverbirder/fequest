import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  redirect: vi.fn(),
  signOut: vi.fn(),
  withdraw: vi.fn(),
}));

vi.mock("~/server/auth", () => ({
  auth: mocks.auth,
  signOut: mocks.signOut,
}));

vi.mock("~/trpc/server", () => ({
  api: {
    setting: {
      withdraw: mocks.withdraw,
    },
  },
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createWithdraw } from "./withdraw";

afterEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReset();
  mocks.redirect.mockReset();
  mocks.signOut.mockReset();
  mocks.withdraw.mockReset();
});

describe("createWithdraw", () => {
  it("redirects when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValueOnce(null);
    const action = createWithdraw();

    await action();

    expect(mocks.redirect).toHaveBeenCalledWith("/");
    expect(mocks.withdraw).not.toHaveBeenCalled();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it("requests withdraw and signs out", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });

    const action = createWithdraw();

    await action();

    expect(mocks.withdraw).toHaveBeenCalled();
    expect(mocks.signOut).toHaveBeenCalledWith({ redirectTo: "/" });
  });

  it("does not sign out when the withdraw request fails", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mocks.withdraw.mockRejectedValueOnce(new Error("fail"));

    const action = createWithdraw();

    await action();

    expect(mocks.withdraw).toHaveBeenCalled();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });
});
