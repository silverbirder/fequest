type NotifyWebhookOptions = {
  payload: Record<string, unknown>;
  webhookUrl: null | string | undefined;
};

export const notifyWebhook = async ({
  payload,
  webhookUrl,
}: NotifyWebhookOptions): Promise<boolean> => {
  const target = webhookUrl?.trim();

  if (!target) {
    return false;
  }

  try {
    const response = await fetch(target, {
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      console.error("Webhook notification failed", {
        status: response.status,
        webhookUrl: target,
      });
      return false;
    }
  } catch (error) {
    console.error("Webhook notification failed", {
      error,
      webhookUrl: target,
    });
    return false;
  }

  return true;
};
