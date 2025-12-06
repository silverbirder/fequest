import { type ProductSummary } from "@repo/type";
import {
  Box,
  Button,
  Empty,
  EmptyContent,
  EmptyMedia,
  Text,
  VStack,
} from "@repo/ui/components";
import Link from "next/link";

type Props = {
  products: ProductSummary[];
};

const formatCount = (value: number) =>
  new Intl.NumberFormat("ja-JP").format(value);

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
            <Box bg="card" key={product.id} p="md" radius="md" w="full">
              <VStack align="start" gap="xs" w="full">
                <Text size="lg" weight="semibold">
                  {product.name}
                </Text>
                <Text color="muted" size="sm">
                  質問 {formatCount(product.featureCount)}件 ・ リアクション{" "}
                  {formatCount(product.reactionCount)}件
                </Text>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/${product.id}`}>プロダクトを開く</Link>
                </Button>
              </VStack>
            </Box>
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
