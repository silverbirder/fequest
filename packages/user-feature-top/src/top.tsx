import { type ProductSummary } from "@repo/type";
import {
  Heading,
  HStack,
  ProductCard,
  Text,
  VStack,
} from "@repo/ui/components";

type Props = {
  products: ProductSummary[];
};

export const Top = ({ products }: Props) => {
  return (
    <VStack align="start" gap="2xl">
      <VStack align="center" gap="md">
        <VStack align="center" gap="sm">
          <Heading level={1}>🗳️ Fequest</Heading>
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
    </VStack>
  );
};
