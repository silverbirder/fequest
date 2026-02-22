import { getHueBaseFromCookieStore } from "@repo/admin-cookie";
import { Setting } from "@repo/admin-feature-setting";
import { cookies } from "next/headers";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

import { createResetHueBase } from "./reset-hue";
import { createUpdateAvatar } from "./update-avatar";
import { createUpdateHueBase } from "./update-hue";
import { createUpdateWebhookUrl } from "./update-webhook";
import { createWithdraw } from "./withdraw";

export default async function Page() {
  const session = await auth();
  const withdraw = createWithdraw();
  const updateAvatar = createUpdateAvatar();
  const updateWebhookUrl = createUpdateWebhookUrl();
  const updateHueBase = createUpdateHueBase();
  const resetHueBase = createResetHueBase();
  const setting = await api.setting.current();
  const cookieStore = await cookies();
  const hueBase = getHueBaseFromCookieStore(cookieStore);

  return (
    <Setting
      avatarUrl={session?.user?.image ?? null}
      hueBase={hueBase}
      onResetHueBase={resetHueBase}
      onUpdateAvatar={updateAvatar}
      onUpdateHueBase={updateHueBase}
      onUpdateWebhookUrl={updateWebhookUrl}
      onWithdraw={withdraw}
      webhookUrl={setting.webhookUrl}
    />
  );
}
