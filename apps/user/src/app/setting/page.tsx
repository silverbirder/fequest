import { Setting } from "@repo/user-feature-setting";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

import { createWithdraw } from "./withdraw";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const withdraw = createWithdraw();

  return <Setting onWithdraw={withdraw} />;
}
