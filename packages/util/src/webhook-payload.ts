type BuildFeatureRequestWebhookPayloadOptions = {
  event: FeatureRequestWebhookEvent;
  productName: string;
  requestTitle: string;
  status?: null | string;
};

type FeatureRequestWebhookEvent =
  | "created"
  | "deleted"
  | "status_changed"
  | "updated";

const eventLabelMap: Record<FeatureRequestWebhookEvent, string> = {
  created: "追加",
  deleted: "削除",
  status_changed: "状態変更",
  updated: "更新",
};

const statusLabelMap: Record<string, string> = {
  closed: "完了",
  open: "未完了",
};

const toNonEmptyText = (value: null | string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
};

export const buildFeatureRequestWebhookPayload = ({
  event,
  productName,
  requestTitle,
  status,
}: BuildFeatureRequestWebhookPayloadOptions) => {
  const resolvedProductName = toNonEmptyText(productName, "Product");
  const resolvedRequestTitle = toNonEmptyText(requestTitle, "(無題)");
  const eventLabel = eventLabelMap[event];
  const lines = [
    "*リクエスト通知*",
    `・種別: ${eventLabel}`,
    `・プロダクト: ${resolvedProductName}`,
    `・タイトル: ${resolvedRequestTitle}`,
  ];

  if (event === "status_changed") {
    const resolvedStatus = status ? (statusLabelMap[status] ?? status) : "不明";
    lines.push(`・ステータス: ${resolvedStatus}`);
  }

  return {
    blocks: [
      {
        text: {
          text: lines.join("\n"),
          type: "mrkdwn",
        },
        type: "section",
      },
    ],
    text: `【${resolvedProductName}】リクエスト${eventLabel}: ${resolvedRequestTitle}`,
    username: "Fequest",
  };
};
