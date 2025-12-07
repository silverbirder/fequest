import type { UrlObject } from "url";

import { formatCount } from "@repo/util";
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
  const requestLabel = formatCount(requestCount);

  return (
    <Box asChild border="default" p="md" radius="lg">
      <Link aria-label={`${name}のプロダクトページ`} href={href}>
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
              weight="semibold"
            >
              {name}
            </Text>
            <Text color="muted" data-slot="product-card-count" size="sm">
              リクエスト {requestLabel}件
            </Text>
            <HStack align="center" gap="xs">
              <Text color="accent" size="sm" weight="semibold">
                プロダクトページへ
              </Text>
              <Text aria-hidden color="accent" size="sm" weight="semibold">
                →
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Link>
    </Box>
  );
};
