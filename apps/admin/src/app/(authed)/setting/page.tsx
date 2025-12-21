import { Setting } from "@repo/admin-feature-setting";

import { createWithdraw } from "./withdraw";

export default async function Page() {
  const withdraw = createWithdraw();

  return <Setting onWithdraw={withdraw} />;
}
