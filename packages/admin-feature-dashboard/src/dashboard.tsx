import {
  Box,
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  HStack,
  Text,
  VStack,
} from "@repo/ui/components";
import Link from "next/link";

type ProductSummary = {
  featureCount: number;
  id: number;
  name: string;
  reactionCount: number;
};

const formatCount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(value);

type Props = {
  products: ProductSummary[];
};

export const Dashboard = ({ products }: Props) => {
  return (
    <VStack gap="xl">
      <HStack align="center" justify="between">
        <VStack gap="xs">
          <Text size="xl" weight="semibold">
            あなたのプロダクト
          </Text>
          <Text color="muted" size="sm">
            質問（フィーチャーリクエスト）とリアクションの合計を確認できます。
          </Text>
        </VStack>
        <Button asChild variant="default">
          <Link href="/products/new">プロダクトを作成</Link>
        </Button>
      </HStack>

      {products.length === 0 ? (
        <Empty>
          <EmptyMedia variant="icon">🤔</EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>まだプロダクトがありません</EmptyTitle>
            <EmptyDescription>
              新しいプロダクトを作成して、フィーチャーリクエストを集めましょう。
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href="/products/new">プロダクトを作成</Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <VStack gap="md">
          {products.map((product) => (
            <Box bg="card" key={product.id} p="md" radius="md">
              <HStack align="center" justify="between">
                <VStack gap="xs">
                  <Text size="lg" weight="semibold">
                    {product.name}
                  </Text>
                  <HStack align="center" gap="md">
                    <Text color="muted" size="sm">
                      質問: {formatCount(product.featureCount)}件
                    </Text>
                    <Text color="muted" size="sm">
                      リアクション: {formatCount(product.reactionCount)}件
                    </Text>
                  </HStack>
                </VStack>
                <Button asChild variant="outline">
                  <Link href={`/products/${product.id}`}>開く</Link>
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
};
