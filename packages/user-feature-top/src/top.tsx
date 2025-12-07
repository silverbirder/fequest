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

type Props = {
  adminDomain: string;
  products: ProductSummary[];
};

export const Top = ({ adminDomain, products }: Props) => {
  const adminHref = adminDomain.trim();

  return (
    <VStack align="start" gap="2xl">
      <VStack align="center" gap="md">
        <VStack align="center" gap="sm">
          <AppLogo asChild>
            <Heading level={1}>Fequest</Heading>
          </AppLogo>
          <Text color="muted" size="lg">
            ほしいとつくるを共有するプラットフォーム
          </Text>
        </VStack>
        <Text color="subtle">
          ユーザーの『ほしい』と開発者の『つくる』をつなぎ、プロダクトを共に育てる場所です。
        </Text>
      </VStack>
      <VStack align="start" gap="md" w="full">
        <Heading level={2}>育成中のプロダクト</Heading>
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
      <VStack align="start" gap="md" w="full">
        <Heading level={2}>開発者の方へ</Heading>
        <VStack align="start" gap="sm">
          <Text color="subtle">
            Fequestの管理ページはこちらからアクセスできます。プロダクトの登録やリクエストの管理が行えます。
          </Text>
          <Button asChild variant="outline">
            <a href={adminHref} rel="noreferrer" target="_blank">
              管理ページへ
            </a>
          </Button>
        </VStack>
      </VStack>
    </VStack>
  );
};
