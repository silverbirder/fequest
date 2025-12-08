import type { PropsWithChildren } from "react";
import type { UrlObject } from "url";

import {
  Box,
  Button,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@repo/ui/components";
import Form from "next/form";
import Link from "next/link";

type Props = PropsWithChildren & {
  backHref: UrlObject;
  defaultValues: {
    content: string;
    title: string;
  };
  featureId: number;
  onDelete?: (formData: FormData) => Promise<void> | void;
  onSubmit: (formData: FormData) => Promise<void> | void;
  productName: string;
  requestTitle?: string;
};

export const RequestEdit = ({
  backHref,
  children,
  defaultValues,
  featureId,
  onDelete,
  onSubmit,
  productName,
  requestTitle,
}: Props) => {
  return (
    <VStack align="start" gap="lg" w="full">
      <VStack align="start" gap="xs" w="full">
        <Text size="lg" weight="bold">
          リクエストを編集
        </Text>
        <Text color="muted">
          {productName} へのリクエスト「{requestTitle ?? defaultValues.title}
          」を更新します。
        </Text>
      </VStack>
      <Form action={onSubmit}>
        <input name="featureId" type="hidden" value={String(featureId)} />
        <VStack align="start" gap="md" w="full">
          <Box asChild w="full">
            <label>
              <VStack align="start" gap="xs" w="full">
                <Text color="subtle" size="sm">
                  タイトル
                </Text>
                <Input
                  defaultValue={defaultValues.title}
                  maxLength={255}
                  name="title"
                  required
                />
              </VStack>
            </label>
          </Box>
          <Box asChild w="full">
            <label>
              <VStack align="start" gap="xs" w="full">
                <Text color="subtle" size="sm">
                  内容
                </Text>
                <Textarea
                  defaultValue={defaultValues.content}
                  name="content"
                  placeholder="改善内容や背景を入力してください"
                  rows={6}
                />
              </VStack>
            </label>
          </Box>
          <HStack gap="sm">
            <Button type="submit">保存する</Button>
            <Button asChild variant="ghost">
              <Link href={backHref} prefetch={false}>
                戻る
              </Link>
            </Button>
          </HStack>
        </VStack>
      </Form>
      {onDelete ? (
        <Box asChild w="full">
          <Form action={onDelete}>
            <input name="featureId" type="hidden" value={String(featureId)} />
            <HStack gap="sm">
              <Button type="submit" variant="destructive">
                リクエストを削除
              </Button>
              {children}
            </HStack>
          </Form>
        </Box>
      ) : (
        (children ?? null)
      )}
    </VStack>
  );
};
