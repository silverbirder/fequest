import { Empty, EmptyDescription, EmptyTitle } from "@repo/ui/components";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("UserApp");

  return (
    <Empty>
      <EmptyTitle>{t("notFoundTitle")}</EmptyTitle>
      <EmptyDescription>{t("notFoundDescription")}</EmptyDescription>
    </Empty>
  );
}
