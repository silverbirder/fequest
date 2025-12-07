import { AspectRatio, Box, Center, Image, Text } from "../../common";

type Props = {
  dataSlot?: string;
  fallbackSlot?: string;
  logoUrl?: null | string;
  name: string;
  sizes?: string;
};

const getInitial = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed[0]?.toUpperCase() ?? "?";
};

export const ProductLogo = ({
  dataSlot = "product-logo",
  fallbackSlot = "product-logo-fallback",
  logoUrl,
  name,
  sizes = "(max-width: 768px) 100vw, 320px",
}: Props) => {
  const safeLogoUrl = logoUrl?.trim() || null;
  const initial = getInitial(name);
  const alt = `${name}のロゴ`;

  return (
    <AspectRatio data-slot={dataSlot} ratio={1}>
      <Box h="full" overflow="hidden" position="relative" radius="md" w="full">
        {safeLogoUrl ? (
          <Image
            alt={alt}
            fill
            loading="lazy"
            sizes={sizes}
            src={safeLogoUrl}
          />
        ) : (
          <Center
            aria-label={alt}
            bg="muted"
            data-slot={fallbackSlot}
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
  );
};

ProductLogo.displayName = "ProductLogo";
