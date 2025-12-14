"use client";

import { type ProductSummary } from "@repo/type";
import {
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
  Heading,
  HStack,
  Input,
  ProductCard,
  SubmitButton,
  Text,
  VStack,
} from "@repo/ui/components";
import { wrapActionWithToast } from "@repo/ui/lib/wrap-action-with-toast";
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
  const actionWithToast = wrapActionWithToast(onCreateProduct, {
    error: "作成に失敗しました",
    loading: "作成中...",
    success: "プロダクトを作成しました",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいプロダクトを作成</DialogTitle>
          <DialogDescription asChild>
            <Text color="muted" size="md">
              名前を入力して作成すると、そのプロダクトの管理ページに移動します。
            </Text>
          </DialogDescription>
        </DialogHeader>
        <form action={actionWithToast} data-slot="create-product-form">
          <VStack gap="md">
            <VStack align="start" gap="xs">
              <label htmlFor={inputId}>
                <Text size="sm" weight="bold">
                  プロダクト名
                </Text>
              </label>
              <Input
                aria-label="プロダクト名"
                id={inputId}
                maxLength={256}
                name="name"
                placeholder="例: Fequest"
                required
              />
              <Text color="muted" size="xs">
                名前は後から変更できます。
              </Text>
            </VStack>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  キャンセル
                </Button>
              </DialogClose>
              <SubmitButton
                formAction={actionWithToast}
                pendingLabel="作成中..."
                variant="default"
              >
                作成する
              </SubmitButton>
            </DialogFooter>
          </VStack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Dashboard = ({ onCreateProduct, products }: Props) => {
  return (
    <VStack gap="2xl">
      {products.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <Text size="lg" weight="bold">
              プロダクトが未登録のようです...。
            </Text>
            <EmptyDescription>
              新しいプロダクトを作成して、リクエストを集めましょう！
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
        <>
          <VStack align="center" gap="sm">
            <Heading level={2}>プロダクト一覧</Heading>
            <Text color="muted" size="lg">
              あなたが登録したプロダクトの一覧です。
            </Text>
          </VStack>
          <HStack gap="md" w="full" wrap="wrap">
            {products.map((product) => (
              <ProductCard
                href={{ pathname: `/products/${product.id}` }}
                key={product.id}
                logoUrl={product.logoUrl}
                name={product.name}
                requestCount={product.featureCount}
              />
            ))}
          </HStack>
          <VStack align="start" borderTop="default" pt="2xl" w="full">
            <Text>新しいプロダクトを作成して、リクエストを集めましょう。</Text>
            <CreateProductDialog
              onCreateProduct={onCreateProduct}
              trigger={
                <Button type="button" variant="default">
                  プロダクトを作成
                </Button>
              }
            />
          </VStack>
        </>
      )}
    </VStack>
  );
};
