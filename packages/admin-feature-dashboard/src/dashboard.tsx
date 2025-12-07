import { type ProductSummary } from "@repo/type";
import {
  Box,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  HStack,
  Input,
  Text,
  VStack,
} from "@repo/ui/components";
import { formatCount } from "@repo/util";
import Link from "next/link";
import { type ReactNode, useId } from "react";

type CreateProductDialogProps = {
  onCreateProduct: Props["onCreateProduct"];
  trigger: ReactNode;
};

type Props = {
  onCreateProduct: (formData: FormData) => Promise<void>;
  products: ProductSummary[];
};

const CreateProductDialog = ({
  onCreateProduct,
  trigger,
}: CreateProductDialogProps) => {
  const inputId = useId();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいプロダクトを作成</DialogTitle>
          <DialogDescription>
            名前を入力して作成すると、そのプロダクトの管理ページに移動します。
          </DialogDescription>
        </DialogHeader>
        <form action={onCreateProduct} data-slot="create-product-form">
          <VStack gap="md">
            <VStack align="start" gap="xs">
              <label htmlFor={inputId}>
                <Text size="sm" weight="semibold">
                  プロダクト名
                </Text>
              </label>
              <Input
                aria-label="プロダクト名"
                id={inputId}
                maxLength={256}
                name="name"
                placeholder="例: プロダクトX"
                required
              />
            </VStack>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  キャンセル
                </Button>
              </DialogClose>
              <Button type="submit" variant="default">
                作成する
              </Button>
            </DialogFooter>
          </VStack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Dashboard = ({ onCreateProduct, products }: Props) => {
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
        <CreateProductDialog
          onCreateProduct={onCreateProduct}
          trigger={
            <Button type="button" variant="default">
              プロダクトを作成
            </Button>
          }
        />
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
            <CreateProductDialog
              onCreateProduct={onCreateProduct}
              trigger={
                <Button type="button" variant="default">
                  プロダクトを作成
                </Button>
              }
            />
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
