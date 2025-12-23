import { jaMessages } from "@repo/messages";
import { Setting } from "@repo/user-feature-setting";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

import { createUpdateAvatar } from "./update-avatar";
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

  const withdraw = createWithdraw();
  const updateAvatar = createUpdateAvatar();

  return (
    <Setting
      avatarUrl={session.user.image ?? null}
      onUpdateAvatar={updateAvatar}
      onWithdraw={withdraw}
    />
  );
}
