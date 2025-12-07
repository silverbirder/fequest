import type { UrlObject } from "url";

import { formatCount } from "@repo/util";
import Link from "next/link";

import {
  AspectRatio,
  Box,
  Center,
  HStack,
  Image,
  Text,
  VStack,
} from "../../common";

type Props = {
  href: UrlObject;
  logoUrl?: null | string;
  name: string;
  requestCount: number;
};

const getInitial = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed[0]?.toUpperCase() ?? "?";
};

export const ProductCard = ({ href, logoUrl, name, requestCount }: Props) => {
  const requestLabel = formatCount(requestCount);
  const initial = getInitial(name);
  const safeLogoUrl = logoUrl?.trim() || null;

  return (
    <Box asChild border="default" p="md" radius="lg">
      <Link aria-label={`${name}のプロダクトページ`} href={href}>
        <VStack align="start" gap="md" w="full">
          <AspectRatio data-slot="product-card-logo" ratio={1}>
            <Box
              h="full"
              overflow="hidden"
              position="relative"
              radius="md"
              w="full"
            >
              {safeLogoUrl ? (
                <Image
                  alt={`${name}のロゴ`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 320px"
                  src={safeLogoUrl}
                />
              ) : (
                <Center
                  aria-label={`${name}のロゴ`}
                  data-slot="product-card-fallback"
                  h="full"
                  w="full"
                >
                  <Text size="xl" weight="semibold">
                    {initial}
                  </Text>
                </Center>
              )}
            </Box>
          </AspectRatio>
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
