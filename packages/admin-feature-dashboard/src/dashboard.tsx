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
import { useTranslations } from "next-intl";
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
  const t = useTranslations("AdminDashboard");
  const inputId = useId();
  const actionWithToast = wrapActionWithToast(onCreateProduct, {
    error: t("toast.create.error"),
    loading: t("toast.create.loading"),
    success: t("toast.create.success"),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("dialog.title")}</DialogTitle>
          <DialogDescription asChild>
            <Text color="muted" size="md">
              {t("dialog.description")}
            </Text>
          </DialogDescription>
        </DialogHeader>
        <form action={actionWithToast} data-slot="create-product-form">
          <VStack gap="md">
            <VStack align="start" gap="xs">
              <label htmlFor={inputId}>
                <Text size="sm" weight="bold">
                  {t("dialog.nameLabel")}
                </Text>
              </label>
              <Input
                aria-label={t("dialog.nameAriaLabel")}
                id={inputId}
                maxLength={256}
                name="name"
                placeholder={t("dialog.namePlaceholder")}
                required
              />
              <Text color="muted" size="xs">
                {t("dialog.nameHelper")}
              </Text>
            </VStack>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  {t("buttons.cancel")}
                </Button>
              </DialogClose>
              <SubmitButton
                formAction={actionWithToast}
                pendingLabel={t("toast.create.loading")}
                variant="default"
              >
                {t("buttons.create")}
              </SubmitButton>
            </DialogFooter>
          </VStack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const Dashboard = ({ onCreateProduct, products }: Props) => {
  const t = useTranslations("AdminDashboard");

  return (
    <VStack gap="2xl">
      {products.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <Text size="lg" weight="bold">
              {t("empty.title")}
            </Text>
            <EmptyDescription>{t("empty.description")}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <CreateProductDialog
              onCreateProduct={onCreateProduct}
              trigger={
                <Button type="button" variant="default">
                  {t("buttons.createProduct")}
                </Button>
              }
            />
          </EmptyContent>
        </Empty>
      ) : (
        <>
          <VStack align="center" gap="sm">
            <Heading level={2}>{t("list.title")}</Heading>
            <Text color="muted" size="lg">
              {t("list.description")}
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
            <Text>{t("list.cta")}</Text>
            <CreateProductDialog
              onCreateProduct={onCreateProduct}
              trigger={
                <Button type="button" variant="default">
                  {t("buttons.createProduct")}
                </Button>
              }
            />
          </VStack>
        </>
      )}
    </VStack>
  );
};
