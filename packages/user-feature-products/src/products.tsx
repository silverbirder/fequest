import { type ProductSummary } from "@repo/type";
import {
  Empty,
  EmptyContent,
  EmptyMedia,
  ProductCard,
  Text,
  VStack,
} from "@repo/ui/components";

type Props = {
  products: ProductSummary[];
};

export const Products = ({ products }: Props) => {
  const hasProducts = products.length > 0;

  return (
    <VStack gap="lg" w="full">
      <VStack gap="xs">
        <Text size="xl" weight="semibold">
          プロダクト一覧
        </Text>
        <Text color="muted" size="sm">
          気になるプロダクトを開いて、フィーチャーを確認・提案できます。
        </Text>
      </VStack>

      {hasProducts ? (
        <VStack gap="md" w="full">
          {products.map((product) => (
            <ProductCard
              href={{ pathname: `/${product.id}` }}
              key={product.id}
              logoUrl={product.logoUrl}
              name={product.name}
              requestCount={product.featureCount}
            />
          ))}
        </VStack>
      ) : (
        <Empty>
          <EmptyMedia variant="icon">🧭</EmptyMedia>
          <EmptyContent>
            <Text weight="semibold">
              まだ公開されているプロダクトがありません
            </Text>
            <Text color="muted" size="sm">
              管理者がプロダクトを作成すると、ここに一覧が表示されます。
            </Text>
          </EmptyContent>
        </Empty>
      )}
    </VStack>
  );
};
