import { jaMessages } from "@repo/messages";
import { getHueBaseFromCookieStore } from "@repo/user-cookie";
import { Setting } from "@repo/user-feature-setting";
import { type Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

import { createResetHueBase } from "./reset-hue";
import { createUpdateAvatar } from "./update-avatar";
import { createUpdateHueBase } from "./update-hue";
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

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const cookieStore = await cookies();
  const hueBase = getHueBaseFromCookieStore(cookieStore);

  const withdraw = createWithdraw();
  const updateAvatar = createUpdateAvatar();
  const updateHueBase = createUpdateHueBase();
  const resetHueBase = createResetHueBase();

  return (
    <Setting
      avatarUrl={session.user.image ?? null}
      hueBase={hueBase}
      onResetHueBase={resetHueBase}
      onUpdateAvatar={updateAvatar}
      onUpdateHueBase={updateHueBase}
      onWithdraw={withdraw}
    />
  );
}
