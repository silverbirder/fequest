import { Empty, EmptyDescription, EmptyTitle } from "@repo/ui/components";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("AdminApp");

  return (
    <Empty>
      <EmptyTitle>404 - Not Found</EmptyTitle>
      <EmptyDescription>{t("notFoundDescription")}</EmptyDescription>
    </Empty>
  );
}
