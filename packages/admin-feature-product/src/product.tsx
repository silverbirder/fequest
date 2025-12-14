"use client";

import { type FeatureRequestCore, type FeatureRequestStatus } from "@repo/type";
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
import { toIsoString } from "@repo/util";

type FeatureRequest = FeatureRequestCore;

type ProductDetail = {
  description?: null | string;
  featureRequests?: FeatureRequest[];
  homePageUrl?: null | string;
  id: number;
  logoUrl?: null | string;
  name: string;
};

type Props = {
  onDelete: (formData: FormData) => Promise<void>;
  onDeleteFeatureRequest: (formData: FormData) => Promise<void>;
  onUpdateDetails: (formData: FormData) => Promise<void>;
  onUpdateFeatureStatus: (formData: FormData) => Promise<void>;
  onUpdateName: (formData: FormData) => Promise<void>;
  product: ProductDetail;
};

const statusCopy = (status: FeatureRequestStatus) =>
  status === "open"
    ? {
        actionLabel: "クローズにする",
        label: "オープン",
        nextStatus: "closed" as const,
      }
    : {
        actionLabel: "オープンに戻す",
        label: "クローズ",
        nextStatus: "open" as const,
      };

export const Product = ({
  onDelete,
  onDeleteFeatureRequest,
  onUpdateDetails,
  onUpdateFeatureStatus,
  onUpdateName,
  product,
}: Props) => {
  const updateNameAction = wrapActionWithToast(onUpdateName, {
    error: "名前の保存に失敗しました",
    loading: "名前を保存中...",
    success: "名前を保存しました",
  });
  const updateDetailsAction = wrapActionWithToast(onUpdateDetails, {
    error: "表示情報の保存に失敗しました",
    loading: "表示情報を保存中...",
    success: "表示情報を保存しました",
  });

  const featureRequests = product.featureRequests ?? [];

  return (
    <VStack gap="xl" w="full">
      <VStack gap="xs">
        <Heading size="lg">プロダクトの管理</Heading>
        <Text color="muted" size="sm">
          プロダクト情報の更新と、質問のステータス管理を行えます。
        </Text>
      </VStack>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="sm" w="full">
          <Text size="sm" weight="semibold">
            プロダクト名
          </Text>
          <form action={updateNameAction} data-slot="rename-form">
            <input name="productId" type="hidden" value={product.id} />
            <HStack align="center" gap="sm" justify="start" wrap="wrap">
              <Box>
                <Input
                  aria-label="プロダクト名"
                  defaultValue={product.name}
                  maxLength={256}
                  name="name"
                  required
                />
              </Box>
              <SubmitButton
                formAction={updateNameAction}
                pendingLabel="保存中..."
                size="sm"
                variant="default"
              >
                名前を保存
              </SubmitButton>
            </HStack>
          </form>
        </VStack>
      </Box>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="md" w="full">
          <VStack align="start" gap="xs">
            <Text size="sm" weight="semibold">
              プロダクトの表示情報
            </Text>
            <Text color="muted" size="sm">
              ロゴと説明文を設定して、ユーザーにわかりやすく伝えましょう。
            </Text>
          </VStack>
          <form action={updateDetailsAction} data-slot="details-form">
            <input name="productId" type="hidden" value={product.id} />
            <VStack align="start" gap="md" w="full">
              <VStack align="start" gap="xs" w="full">
                <Text size="sm" weight="medium">
                  ロゴURL (任意)
                </Text>
                <Input
                  aria-label="プロダクトロゴURL"
                  defaultValue={product.logoUrl ?? ""}
                  maxLength={2048}
                  name="logoUrl"
                  placeholder="https://example.com/logo.png"
                />
                <Text color="muted" size="xs">
                  画像のURLを入力すると、クライアント側で表示できます。
                </Text>
              </VStack>

              <VStack align="start" gap="xs" w="full">
                <Text size="sm" weight="medium">
                  ホームページURL (任意)
                </Text>
                <Input
                  aria-label="プロダクトホームページURL"
                  defaultValue={product.homePageUrl ?? ""}
                  maxLength={2048}
                  name="homePageUrl"
                  placeholder="https://example.com"
                />
                <Text color="muted" size="xs">
                  プロダクトの公式サイトやLPへのリンクを登録できます。
                </Text>
              </VStack>

              <VStack align="start" gap="xs" w="full">
                <Text size="sm" weight="medium">
                  プロダクト説明文 (任意)
                </Text>
                <Textarea
                  aria-label="プロダクト説明文"
                  defaultValue={product.description ?? ""}
                  maxLength={5000}
                  name="description"
                  placeholder="サービスの概要やサポートポリシーを記載してください"
                  rows={4}
                />
                <Text color="muted" size="xs">
                  5000文字まで登録できます。空欄にすると未設定になります。
                </Text>
              </VStack>

              <HStack justify="end" w="full">
                <SubmitButton
                  formAction={updateDetailsAction}
                  pendingLabel="保存中..."
                  size="sm"
                  variant="default"
                >
                  表示情報を保存
                </SubmitButton>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="sm" w="full">
          <Text size="sm" weight="semibold">
            プロダクトを削除
          </Text>
          <Text color="muted" size="sm">
            この操作は取り消せません。プロダクトと関連する質問がすべて削除されます。
          </Text>
          <form action={onDelete} data-slot="delete-form">
            <input name="productId" type="hidden" value={product.id} />
            <Button size="sm" type="submit" variant="destructive">
              プロダクトを削除
            </Button>
          </form>
        </VStack>
      </Box>

      <VStack gap="md" w="full">
        <VStack gap="xs" w="full">
          <Heading size="lg">質問一覧</Heading>
          <Text color="muted" size="sm">
            受け付けた質問の内容とステータスを確認できます。
          </Text>
        </VStack>

        {featureRequests.length === 0 ? (
          <Box bg="white" p="md" radius="md" w="full">
            <Text color="muted">まだ質問がありません。</Text>
          </Box>
        ) : (
          <VStack gap="md" w="full">
            {featureRequests.map((feature) => {
              const copy = statusCopy(feature.status);
              const title = feature.title?.trim() || "無題の質問";
              const formatSuccess = (label: string) =>
                label.replace(/する$/, "しました").replace(/す$/, "しました");
              const formatLoading = (label: string) =>
                label
                  .replace(/する$/, "しています")
                  .replace(/す$/, "しています");
              const statusSuccess = formatSuccess(copy.actionLabel);
              const statusLoading = formatLoading(copy.actionLabel);
              const statusAction = wrapActionWithToast(onUpdateFeatureStatus, {
                error: `${copy.actionLabel}に失敗しました`,
                loading: statusLoading,
                success: statusSuccess,
              });

              return (
                <Box
                  bg="white"
                  border="default"
                  key={feature.id}
                  p="md"
                  radius="md"
                  w="full"
                >
                  <VStack gap="sm" w="full">
                    <HStack
                      align="start"
                      gap="sm"
                      justify="between"
                      w="full"
                      wrap="wrap"
                    >
                      <VStack align="start" gap="xs" w="full">
                        <Text size="lg" weight="semibold">
                          {title}
                        </Text>
                        <Text color="muted" size="sm">
                          {feature.content}
                        </Text>
                      </VStack>
                      <HStack align="center" gap="sm" justify="end">
                        <Box bg="muted" px="sm" py="xs" radius="full">
                          <Text size="xs" weight="medium">
                            {copy.label}
                          </Text>
                        </Box>
                        <form
                          action={statusAction}
                          data-feature-id={feature.id}
                          data-slot="feature-status-form"
                        >
                          <input
                            name="featureId"
                            type="hidden"
                            value={feature.id}
                          />
                          <input
                            name="status"
                            type="hidden"
                            value={copy.nextStatus}
                          />
                          <SubmitButton
                            formAction={statusAction}
                            pendingLabel="更新中..."
                            size="sm"
                            variant="outline"
                          >
                            {copy.actionLabel}
                          </SubmitButton>
                        </form>
                        <form
                          action={onDeleteFeatureRequest}
                          data-feature-id={feature.id}
                          data-slot="feature-delete-form"
                        >
                          <input
                            name="productId"
                            type="hidden"
                            value={product.id}
                          />
                          <input
                            name="featureId"
                            type="hidden"
                            value={feature.id}
                          />
                          <Button size="sm" type="submit" variant="destructive">
                            質問を削除
                          </Button>
                        </form>
                      </HStack>
                    </HStack>
                    <HStack gap="md">
                      <Text color="subtle" size="xs">
                        作成日: {toIsoString(feature.createdAt)}
                      </Text>
                      <Text color="subtle" size="xs">
                        更新日: {toIsoString(feature.updatedAt)}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};
