import { useTranslations } from "next-intl";

import { Button, HStack, Text, VStack } from "../../common";

export type Props = {
  creditText?: string;
  featureRequestHref?: string;
  inquiryHref?: string;
  servicesHref?: string;
};

export const Footer = ({
  creditText,
  featureRequestHref = "https://fequest.vercel.app/8",
  inquiryHref = "https://forms.gle/G25K58MVsSWit75n9",
  servicesHref = "https://sites.google.com/view/silverbirders-services",
}: Props) => {
  const t = useTranslations("UI.footer");

  return (
    <VStack asChild borderTop="default" gap="sm" p="md" w="full">
      <footer>
        <VStack gap="sm" w="full">
          <HStack justify="center" w="full">
            <Text align="center" color="muted" size="sm">
              {creditText ?? t("credit")}
            </Text>
          </HStack>
          <HStack gap="md" justify="center" w="full" wrap="wrap">
            <Button asChild size="sm" variant="link">
              <a href={inquiryHref} rel="noreferrer" target="_blank">
                {t("inquiry")}
              </a>
            </Button>
            <Button asChild size="sm" variant="link">
              <a href={servicesHref} rel="noreferrer" target="_blank">
                {t("services")}
              </a>
            </Button>
            <Button asChild size="sm" variant="link">
              <a href={featureRequestHref} rel="noreferrer" target="_blank">
                {t("featureRequest")}
              </a>
            </Button>
          </HStack>
        </VStack>
      </footer>
    </VStack>
  );
};
