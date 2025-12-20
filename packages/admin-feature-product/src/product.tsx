"use client";

import {
  type FeatureRequestCore,
  type FeatureRequestStatus,
  type FeatureRequestUser,
} from "@repo/type";
import { type ReactionSummary } from "@repo/type";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  RequestCard,
  SubmitButton,
  Text,
  Textarea,
  VStack,
} from "@repo/ui/components";
import { wrapActionWithToast } from "@repo/ui/lib/wrap-action-with-toast";
import { buildUserProductUrl } from "@repo/util";

type FeatureRequestWithUser = FeatureRequestCore & {
  reactionSummaries?: null | ReactionSummary[];
  user?: FeatureRequestUser | null;
};

type ProductDetail = {
  description?: null | string;
  featureRequests?: FeatureRequestWithUser[];
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
  userDomainUrl: string;
};

const toTimestamp = (value: FeatureRequestCore["createdAt"]) => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
};

const getReactionCount = (feature: FeatureRequestWithUser) =>
  (feature.reactionSummaries ?? []).reduce(
    (total, reaction) => total + reaction.count,
    0,
  );

const sortFeatureRequests = (features: FeatureRequestWithUser[]) =>
  [...features].sort((left, right) => {
    const leftReactions = getReactionCount(left);
    const rightReactions = getReactionCount(right);

    if (leftReactions !== rightReactions) {
      return rightReactions - leftReactions;
    }

    const leftCreatedAt = toTimestamp(left.createdAt);
    const rightCreatedAt = toTimestamp(right.createdAt);

    if (leftCreatedAt !== rightCreatedAt) {
      return leftCreatedAt - rightCreatedAt;
    }

    return left.id - right.id;
  });

const statusCopy = (status: FeatureRequestStatus) =>
  status === "open"
    ? {
        actionLabel: "完了にする",
        nextStatus: "closed" as const,
        toast: {
          error: "完了への変更に失敗しました",
          loading: "完了にしています",
          success: "完了にしました",
        },
      }
    : {
        actionLabel: "未完了に戻す",
        nextStatus: "open" as const,
        toast: {
          error: "未完了に戻すことに失敗しました",
          loading: "未完了に戻しています",
          success: "未完了に戻しました",
        },
      };

export const Product = ({
  onDelete,
  onDeleteFeatureRequest,
  onUpdateDetails,
  onUpdateFeatureStatus,
  onUpdateName,
  product,
  userDomainUrl,
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
  const deleteProductAction = wrapActionWithToast(onDelete, {
    error: "プロダクトの削除に失敗しました",
    loading: "プロダクトを削除中...",
    success: "プロダクトを削除しました",
  });
  const deleteFeatureRequestAction = wrapActionWithToast(
    onDeleteFeatureRequest,
    {
      error: "リクエストの削除に失敗しました",
      loading: "リクエストを削除中...",
      success: "リクエストを削除しました",
    },
  );

  const featureRequests = sortFeatureRequests(product.featureRequests ?? []);
  const userProductUrl = buildUserProductUrl(userDomainUrl, product.id);

  const productNameInputId = `product-name-${product.id}`;
  const productLogoUrlInputId = `product-logo-url-${product.id}`;
  const productHomePageUrlInputId = `product-homepage-url-${product.id}`;
  const productDescriptionInputId = `product-description-${product.id}`;

  return (
    <VStack gap="xl" w="full">
      <VStack gap="xs" w="full">
        <HStack align="center" justify="between" w="full" wrap="wrap">
          <Heading size="lg">プロダクトの管理</Heading>
          <Button asChild size="sm" variant="outline">
            <a
              aria-label={`ユーザー側のプロダクトページ ${userProductUrl}`}
              href={userProductUrl}
              rel="noreferrer"
              target="_blank"
            >
              ユーザー向けページ
            </a>
          </Button>
        </HStack>
        <Text color="muted" size="sm">
          プロダクト情報の更新と、リクエストのステータス管理を行えます。
        </Text>
      </VStack>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="sm" w="full">
          <Text asChild size="sm" weight="bold">
            <label htmlFor={productNameInputId}>プロダクト名</label>
          </Text>
          <Box asChild w="full">
            <form action={updateNameAction} data-slot="rename-form">
              <input name="productId" type="hidden" value={product.id} />
              <VStack gap="sm" w="full">
                <Box grow="1" minW="0" w="full">
                  <Input
                    aria-label="プロダクト名"
                    defaultValue={product.name}
                    id={productNameInputId}
                    maxLength={256}
                    name="name"
                    required
                  />
                </Box>
                <HStack justify="end" w="full">
                  <SubmitButton
                    formAction={updateNameAction}
                    pendingLabel="保存中..."
                    size="sm"
                    variant="default"
                  >
                    名前を保存
                  </SubmitButton>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="md" w="full">
          <VStack align="start" gap="xs">
            <Text size="sm" weight="bold">
              プロダクトの補足情報
            </Text>
            <Text color="muted" size="sm">
              ロゴや説明文を設定して、ユーザーにわかりやすく伝えましょう。
            </Text>
          </VStack>
          <Box asChild w="full">
            <form action={updateDetailsAction} data-slot="details-form">
              <input name="productId" type="hidden" value={product.id} />
              <VStack align="start" gap="md" w="full">
                <VStack align="start" gap="xs" w="full">
                  <Text asChild size="sm" weight="bold">
                    <label htmlFor={productLogoUrlInputId}>
                      ロゴURL (任意)
                    </label>
                  </Text>
                  <Box w="full">
                    <Input
                      aria-label="プロダクトロゴURL"
                      defaultValue={product.logoUrl ?? ""}
                      id={productLogoUrlInputId}
                      maxLength={2048}
                      name="logoUrl"
                      placeholder="https://example.com/logo.png"
                    />
                  </Box>
                  <Text color="muted" size="xs">
                    画像のURLを入力すると、ユーザーにプロダクトのロゴが表示されます。
                  </Text>
                </VStack>

                <VStack align="start" gap="xs" w="full">
                  <Text asChild size="sm" weight="bold">
                    <label htmlFor={productHomePageUrlInputId}>
                      ホームページURL (任意)
                    </label>
                  </Text>
                  <Box w="full">
                    <Input
                      aria-label="プロダクトホームページURL"
                      defaultValue={product.homePageUrl ?? ""}
                      id={productHomePageUrlInputId}
                      maxLength={2048}
                      name="homePageUrl"
                      placeholder="https://example.com"
                    />
                  </Box>
                  <Text color="muted" size="xs">
                    プロダクトの公式サイトやLPへのリンクを登録できます。
                  </Text>
                </VStack>

                <VStack align="start" gap="xs" w="full">
                  <Text asChild size="sm" weight="bold">
                    <label htmlFor={productDescriptionInputId}>
                      プロダクト説明文 (任意)
                    </label>
                  </Text>
                  <Box w="full">
                    <Textarea
                      aria-label="プロダクト説明文"
                      defaultValue={product.description ?? ""}
                      id={productDescriptionInputId}
                      maxLength={5000}
                      name="description"
                      placeholder="サービスの概要などを記載してください"
                      rows={4}
                    />
                  </Box>
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
          </Box>
        </VStack>
      </Box>

      <VStack borderTop="default" gap="md" pt="xl" w="full">
        <VStack gap="xs" w="full">
          <Heading size="lg">リクエスト一覧</Heading>
          <Text color="muted" size="sm">
            受け付けたリクエストの内容とステータスを確認できます。
          </Text>
        </VStack>

        {featureRequests.length === 0 ? (
          <Box bg="white" p="md" radius="md" w="full">
            <Text color="muted">まだリクエストがありません。</Text>
          </Box>
        ) : (
          <VStack gap="md" w="full">
            {featureRequests.map((feature) => {
              const copy = statusCopy(feature.status);
              const title = feature.title?.trim() || "無題のリクエスト";
              const statusAction = wrapActionWithToast(onUpdateFeatureStatus, {
                error: copy.toast.error,
                loading: copy.toast.loading,
                success: copy.toast.success,
              });

              return (
                <Box bg="white" key={feature.id} p="md" radius="md" w="full">
                  <VStack gap="sm" w="full">
                    <RequestCard
                      avatar={feature.user ?? undefined}
                      detail={{
                        content: (
                          <Box bg="muted" p="md" radius="sm" w="full">
                            <Textarea
                              aria-label="機能リクエストの内容"
                              readOnly
                              value={feature.content || "詳細はありません。"}
                              variant="display"
                            />
                          </Box>
                        ),
                        createdAt: feature.createdAt,
                        title,
                        updatedAt: feature.updatedAt,
                      }}
                      idBase={`admin-feature-${feature.id}`}
                      reactions={feature.reactionSummaries ?? []}
                      reactionsInteractive={false}
                      status={feature.status}
                      text={title}
                    />
                    <HStack
                      borderTop="default"
                      gap="md"
                      justify="between"
                      pt="sm"
                      w="full"
                    >
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
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" type="button" variant="destructive">
                            リクエストを削除
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              リクエストを削除
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              この操作は取り消せません。リクエストは完全に削除されます。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <form
                            action={deleteFeatureRequestAction}
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
                            <AlertDialogFooter>
                              <AlertDialogCancel>キャンセル</AlertDialogCancel>
                              <SubmitButton
                                formAction={deleteFeatureRequestAction}
                                pendingLabel="削除中..."
                                size="sm"
                                variant="destructive"
                              >
                                削除する
                              </SubmitButton>
                            </AlertDialogFooter>
                          </form>
                        </AlertDialogContent>
                      </AlertDialog>
                    </HStack>
                  </VStack>
                </Box>
              );
            })}
          </VStack>
        )}
      </VStack>

      <Box bg="white" p="lg" radius="lg" w="full">
        <VStack align="start" gap="sm" w="full">
          <Text size="sm" weight="bold">
            プロダクトを削除
          </Text>
          <AlertDialog>
            <VStack align="start" gap="sm" w="full">
              <Text color="muted" size="sm">
                この操作は取り消せません。プロダクトと関連するリクエストがすべて削除されます。
              </Text>
              <HStack justify="end" w="full">
                <AlertDialogTrigger asChild>
                  <Button size="sm" type="button" variant="destructive">
                    プロダクトを削除
                  </Button>
                </AlertDialogTrigger>
              </HStack>
            </VStack>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>プロダクトを削除</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は取り消せません。プロダクトと関連するリクエストがすべて削除されます。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <form action={deleteProductAction} data-slot="delete-form">
                <input name="productId" type="hidden" value={product.id} />
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <SubmitButton
                    formAction={deleteProductAction}
                    pendingLabel="削除中..."
                    size="sm"
                    variant="destructive"
                  >
                    削除する
                  </SubmitButton>
                </AlertDialogFooter>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </VStack>
      </Box>
    </VStack>
  );
};
