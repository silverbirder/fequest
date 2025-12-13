"use client";

import type { UrlObject } from "url";

import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  SubmitButton,
  Text,
  Textarea,
  VStack,
} from "@repo/ui/components";
import { wrapActionWithToast } from "@repo/ui/lib/wrap-action-with-toast";
import { ArrowLeft } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useId } from "react";

type Props = {
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
  defaultValues,
  featureId,
  onDelete,
  onSubmit,
  productName,
  requestTitle,
}: Props) => {
  const submitFormId = useId();
  const deleteFormId = useId();

  const submitAction = wrapActionWithToast(onSubmit, {
    error: "保存に失敗しました",
    loading: "保存中...",
    success: "保存しました",
  });

  return (
    <VStack gap="xl" w="full">
      <VStack align="start" gap="md" w="full">
        <Heading size="lg">リクエストの編集</Heading>
        <Text color="muted">
          {productName} へのリクエスト「{requestTitle ?? defaultValues.title}
          」を更新します。
        </Text>
      </VStack>
      <Box asChild bg="white" p="lg" radius="md" w="full">
        <VStack align="start" bg="white" gap="lg" w="full">
          <VStack align="start" gap="lg" w="full">
            <Box asChild w="full">
              <VStack align="start" gap="xs" w="full">
                <Text asChild color="subtle" size="sm">
                  <label htmlFor="title">タイトル</label>
                </Text>
                <Input
                  defaultValue={defaultValues.title}
                  form={submitFormId}
                  id="title"
                  maxLength={255}
                  name="title"
                  required
                />
              </VStack>
            </Box>
            <Box asChild w="full">
              <VStack align="start" gap="xs" w="full">
                <Text asChild color="subtle" size="sm">
                  <label htmlFor="content">内容</label>
                </Text>
                <Textarea
                  defaultValue={defaultValues.content}
                  form={submitFormId}
                  id="content"
                  name="content"
                  placeholder="改善内容や背景を入力してください"
                  rows={6}
                />
              </VStack>
            </Box>
            <HStack borderTop="default" justify="between" pt="lg" w="full">
              <Form action={submitAction} id={submitFormId}>
                <input
                  name="featureId"
                  type="hidden"
                  value={String(featureId)}
                />
                <SubmitButton
                  formAction={submitAction}
                  pendingLabel="保存中..."
                >
                  保存する
                </SubmitButton>
              </Form>
              {onDelete && (
                <Form action={onDelete} id={deleteFormId}>
                  <input
                    name="featureId"
                    type="hidden"
                    value={String(featureId)}
                  />
                  <Button type="submit" variant="destructive">
                    リクエストを削除
                  </Button>
                </Form>
              )}
            </HStack>
          </VStack>
        </VStack>
      </Box>
      <Button asChild variant="link">
        <Link href={backHref} prefetch={false}>
          <ArrowLeft />
          戻る
        </Link>
      </Button>
    </VStack>
  );
};
