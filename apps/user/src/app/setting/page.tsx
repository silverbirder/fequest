import { jaMessages } from "@repo/messages";
import { getHueBaseFromCookieStore } from "@repo/user-cookie";
import { Setting } from "@repo/user-feature-setting";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

import { createResetHueBase } from "./reset-hue";
import { createUpdateAvatar } from "./update-avatar";
import { createUpdateHueBase } from "./update-hue";
import { createUpdateWebhookUrl } from "./update-webhook";
import { createWithdraw } from "./withdraw";

const appName = jaMessages.UserFeatureTop.appName;
const settingTitle = jaMessages.UserSetting.title;
const settingDescription = jaMessages.UserSetting.description;

export const metadata: Metadata = {
  description: settingDescription,
  openGraph: {
    description: settingDescription,
    title: `${settingTitle} | ${appName}`,
  },
  title: `${settingTitle} | ${appName}`,
};

export default async function Page({ searchParams }: PageProps<"/setting">) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const cookieStore = await cookies();
  const hueBase = getHueBaseFromCookieStore(cookieStore);

  const withdraw = createWithdraw();
  const updateAvatar = createUpdateAvatar();
  const updateWebhookUrl = createUpdateWebhookUrl();
  const updateHueBase = createUpdateHueBase();
  const resetHueBase = createResetHueBase();
  const setting = await api.setting.current();
  const resolvedSearchParams = await searchParams;
  const showWebhookRequiredToast = resolvedSearchParams?.from === "watch";

  return (
    <Setting
      avatarUrl={session.user.image ?? null}
      hueBase={hueBase}
      onResetHueBase={resetHueBase}
      onUpdateAvatar={updateAvatar}
      onUpdateHueBase={updateHueBase}
      onUpdateWebhookUrl={updateWebhookUrl}
      onWithdraw={withdraw}
      showWebhookRequiredToast={showWebhookRequiredToast}
      webhookUrl={setting.webhookUrl}
    />
  );
}
