import { Box, Textarea } from "@repo/ui/components";
import { useTranslations } from "next-intl";

type Props = {
  content: string;
};

export const FeatureRequestContent = (props: Props) => {
  const t = useTranslations("UserFeatureProduct");

  return (
    <Box bg="muted" p="md" radius="sm" w="full">
      <Textarea
        aria-label={t("requestContentAriaLabel")}
        readOnly
        value={props.content}
        variant="display"
      />
    </Box>
  );
};
