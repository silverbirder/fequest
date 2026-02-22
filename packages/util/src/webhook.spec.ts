import { afterEach, describe, expect, it, vi } from "vitest";

import { notifyWebhook } from "./webhook";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("notifyWebhook", () => {
  it("returns false when webhook url is empty", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as typeof fetch;

    await expect(
      notifyWebhook({
        payload: { text: "hello" },
        webhookUrl: "   ",
      }),
    ).resolves.toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts json payload and returns true on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as typeof fetch;

    await expect(
      notifyWebhook({
        payload: { text: "hello" },
        webhookUrl: "https://hooks.slack.com/services/T/B/C",
      }),
    ).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://hooks.slack.com/services/T/B/C",
      expect.objectContaining({
        body: JSON.stringify({ text: "hello" }),
        method: "POST",
      }),
    );
  });

  it("returns false when response is not ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    global.fetch = fetchMock as typeof fetch;

    await expect(
      notifyWebhook({
        payload: { text: "hello" },
        webhookUrl: "https://hooks.slack.com/services/T/B/C",
      }),
    ).resolves.toBe(false);
  });
});
