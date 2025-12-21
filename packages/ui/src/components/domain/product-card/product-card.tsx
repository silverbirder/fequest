import type { UrlObject } from "url";

import { formatCount } from "@repo/util";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Box, HStack, Text, VStack } from "../../common";
import { ProductLogo } from "../product-logo";

type Props = {
  href: UrlObject;
  logoUrl?: null | string;
  name: string;
  requestCount: number;
};

export const ProductCard = ({ href, logoUrl, name, requestCount }: Props) => {
  const t = useTranslations("UI.productCard");
  const requestLabel = formatCount(requestCount);

  return (
    <Box asChild bg="white" border="default" p="md" radius="lg">
      <Link aria-label={t("ariaLabel", { name })} href={href}>
        <VStack align="start" gap="md" w="full">
          <ProductLogo
            dataSlot="product-card-logo"
            fallbackSlot="product-card-fallback"
            logoUrl={logoUrl}
            name={name}
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <VStack align="start" gap="xs" w="full">
            <Text
              data-slot="product-card-name"
              size="lg"
              truncate
              weight="bold"
            >
              {name}
            </Text>
            <Text color="muted" data-slot="product-card-count" size="sm">
              {t("requestCount", { count: requestLabel })}
            </Text>
            <HStack align="center" gap="xs">
              <Text color="accent" size="sm" weight="bold">
                {t("linkLabel")}
              </Text>
              <Text aria-hidden color="accent" size="sm" weight="bold">
                {t("arrow")}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Link>
    </Box>
  );
};
