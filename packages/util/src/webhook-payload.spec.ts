import { describe, expect, it } from "vitest";

import { buildFeatureRequestWebhookPayload } from "./webhook-payload";

describe("buildFeatureRequestWebhookPayload", () => {
  it("builds consistent payload format for created events", () => {
    const payload = buildFeatureRequestWebhookPayload({
      event: "created",
      productName: "ジブンノート",
      requestTitle: "テスト",
    });

    expect(payload).toMatchObject({
      text: "【ジブンノート】リクエスト追加: テスト",
      username: "Fequest",
    });
    expect(payload.blocks[0]).toMatchObject({
      text: {
        text: expect.stringContaining("・種別: 追加"),
        type: "mrkdwn",
      },
      type: "section",
    });
    expect(payload.blocks[0]).toMatchObject({
      text: {
        text: expect.not.stringContaining("実行者"),
      },
    });
  });
});
