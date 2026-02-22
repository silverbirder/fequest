import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  redirect: vi.fn(),
  revalidatePath: vi.fn(),
  updateWebhookUrl: vi.fn(),
}));

vi.mock("~/server/auth", () => ({
  auth: mocks.auth,
}));

vi.mock("~/trpc/server", () => ({
  api: {
    setting: {
      updateWebhookUrl: mocks.updateWebhookUrl,
    },
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

import { createUpdateWebhookUrl } from "./update-webhook";

const createFormData = (webhookUrl: string) => {
  const formData = new FormData();
  formData.set("webhookUrl", webhookUrl);
  return formData;
};

afterEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReset();
  mocks.redirect.mockReset();
  mocks.revalidatePath.mockReset();
  mocks.updateWebhookUrl.mockReset();
});

describe("createUpdateWebhookUrl", () => {
  it("redirects when the user is not authenticated", async () => {
    mocks.auth.mockResolvedValueOnce(null);
    const action = createUpdateWebhookUrl();

    await action(createFormData("https://hooks.slack.com/services/T/B/C"));

    expect(mocks.redirect).toHaveBeenCalledWith("/");
    expect(mocks.updateWebhookUrl).not.toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("updates the webhook url and revalidates", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });
    const action = createUpdateWebhookUrl();

    await action(createFormData("  https://hooks.slack.com/services/T/B/C  "));

    expect(mocks.updateWebhookUrl).toHaveBeenCalledWith(
      "https://hooks.slack.com/services/T/B/C",
    );
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/setting");
  });

  it("does not revalidate when update fails", async () => {
    mocks.auth.mockResolvedValueOnce({ user: { id: "user-1" } });
    mocks.updateWebhookUrl.mockRejectedValueOnce(new Error("fail"));
    const action = createUpdateWebhookUrl();

    await action(createFormData("https://hooks.slack.com/services/T/B/C"));

    expect(mocks.updateWebhookUrl).toHaveBeenCalled();
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
