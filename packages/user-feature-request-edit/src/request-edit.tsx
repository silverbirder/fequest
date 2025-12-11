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
import { ArrowLeft } from "lucide-react";
import Form from "next/form";
import Link from "next/link";

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
          <VStack asChild w="full">
            <Form action={onSubmit} id="request-edit-form">
              <input name="featureId" type="hidden" value={String(featureId)} />
              <VStack align="start" gap="lg" w="full">
                <Box asChild w="full">
                  <VStack align="start" gap="xs" w="full">
                    <Text asChild color="subtle" size="sm">
                      <label htmlFor="title">タイトル</label>
                    </Text>
                    <Input
                      defaultValue={defaultValues.title}
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
                      id="content"
                      name="content"
                      placeholder="改善内容や背景を入力してください"
                      rows={6}
                    />
                  </VStack>
                </Box>
              </VStack>
              <HStack borderTop="default" justify="between" pt="lg" w="full">
                <SubmitButton pendingLabel="保存中...">保存する</SubmitButton>
                {onDelete && (
                  <Button
                    formAction={onDelete}
                    type="submit"
                    variant="destructive"
                  >
                    リクエストを削除
                  </Button>
                )}
              </HStack>
            </Form>
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
