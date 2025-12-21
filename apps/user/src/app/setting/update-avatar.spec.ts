import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
  updateAvatar: vi.fn(),
}));

vi.mock("~/server/auth", () => ({
  auth: mocks.auth,
}));

vi.mock("~/trpc/server", () => ({
  api: {
    setting: {
      updateAvatar: mocks.updateAvatar,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createUpdateAvatar } from "./update-avatar";

const createFormData = (avatarUrl: string) => {
  const formData = new FormData();
  formData.set("avatarUrl", avatarUrl);
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReset();
  mocks.redirect.mockReset();
  mocks.revalidatePath.mockReset();
  mocks.updateAvatar.mockReset();
});

describe("createUpdateAvatar", () => {
  it("redirects when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValueOnce(null);
    const action = createUpdateAvatar();

    await action(createFormData("https://example.com/avatar.png"));

    expect(mocks.redirect).toHaveBeenCalledWith("/");
    expect(mocks.updateAvatar).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("updates the avatar and revalidates", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });
    const action = createUpdateAvatar();

    await action(createFormData("  https://example.com/avatar.png  "));

    expect(mocks.updateAvatar).toHaveBeenCalledWith(
      "https://example.com/avatar.png",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/setting");
  });

  it("does not revalidate when update fails", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mocks.updateAvatar.mockRejectedValueOnce(new Error("fail"));
    const action = createUpdateAvatar();

    await action(createFormData("https://example.com/avatar.png"));

    expect(mocks.updateAvatar).toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
