import { Setting } from "@repo/user-feature-setting";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

import { createUpdateAvatar } from "./update-avatar";
import { createWithdraw } from "./withdraw";

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
