import { Setting } from "@repo/admin-feature-setting";

import { auth } from "~/server/auth";

import { createUpdateAvatar } from "./update-avatar";
import { createWithdraw } from "./withdraw";

export default async function Page() {
  const session = await auth();
  const withdraw = createWithdraw();
  const updateAvatar = createUpdateAvatar();

  return (
    <Setting
      avatarUrl={session?.user?.image ?? null}
      onUpdateAvatar={updateAvatar}
      onWithdraw={withdraw}
    />
  );
}
