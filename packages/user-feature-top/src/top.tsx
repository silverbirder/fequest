import { type ProductSummary } from "@repo/type";
import {
  AppLogo,
  Button,
  Heading,
  HStack,
  ProductCard,
  Text,
  VStack,
} from "@repo/ui/components";
import { useTranslations } from "next-intl";

type Props = {
  adminDomain: string;
  products: ProductSummary[];
};

export const Top = ({ adminDomain, products }: Props) => {
  const adminHref = adminDomain.trim();
  const t = useTranslations("UserFeatureTop");

  return (
    <VStack gap="2xl" w="full">
      <VStack align="center" gap="md">
        <VStack align="center" gap="sm">
          <AppLogo asChild>
            <Heading level={1}>{t("appName")}</Heading>
          </AppLogo>
          <Text color="muted" size="lg">
            {t("hero.tagline")}
          </Text>
        </VStack>
        <Text color="subtle">
          {t("hero.description.prefix")}
          <Text asChild color="accent" display="inline" weight="bold">
            <span>{t("hero.description.want")}</span>
          </Text>
          {t("hero.description.middle")}
          <Text asChild color="accent" display="inline" weight="bold">
            <span>{t("hero.description.build")}</span>
          </Text>
          {t("hero.description.suffix")}
        </Text>
      </VStack>
      {products.length > 0 && (
        <VStack align="start" gap="md" w="full">
          <Heading level={2}>{t("sections.productsTitle")}</Heading>
          <HStack gap="md" wrap="wrap">
            {products.map((product) => (
              <ProductCard
                href={{ pathname: `/${product.id}` }}
                key={product.id}
                logoUrl={product.logoUrl}
                name={product.name}
                requestCount={product.featureCount}
              />
            ))}
          </HStack>
        </VStack>
      )}
      <VStack align="start" gap="md" w="full">
        <Heading level={2}>{t("sections.developerTitle")}</Heading>
        <VStack align="start" gap="sm">
          <Text color="subtle">{t("sections.developerDescription")}</Text>
          <Button asChild variant="outline">
            <a href={adminHref} rel="noreferrer" target="_blank">
              {t("sections.adminLinkLabel")}
            </a>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};
