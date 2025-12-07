import { type FeatureRequestCore, type FeatureRequestStatus } from "@repo/type";
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@repo/ui/components";

type FeatureRequest = FeatureRequestCore;

type ProductDetail = {
  description?: null | string;
  featureRequests?: FeatureRequest[];
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

const formatDateTime = (value?: Date | null | string) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ja-JP");
};

export const Product = ({
  onDelete,
  onDeleteFeatureRequest,
  onUpdateDetails,
  onUpdateFeatureStatus,
  onUpdateName,
  product,
}: Props) => {
  const featureRequests = product.featureRequests ?? [];

  return (
    <VStack gap="xl" w="full">
      <VStack gap="xs">
        <Heading size="lg">プロダクトの管理</Heading>
        <Text color="muted" size="sm">
          プロダクト情報の更新と、質問のステータス管理を行えます。
        </Text>
      </VStack>

      <Box bg="card" p="lg" radius="lg" w="full">
        <VStack align="start" gap="sm" w="full">
          <Text size="sm" weight="semibold">
            プロダクト名
          </Text>
          <form action={onUpdateName} data-slot="rename-form">
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
              <Button size="sm" type="submit" variant="default">
                名前を保存
              </Button>
            </HStack>
          </form>
        </VStack>
      </Box>

      <Box bg="card" p="lg" radius="lg" w="full">
        <VStack align="start" gap="md" w="full">
          <VStack align="start" gap="xs">
            <Text size="sm" weight="semibold">
              プロダクトの表示情報
            </Text>
            <Text color="muted" size="sm">
              ロゴと説明文を設定して、ユーザーにわかりやすく伝えましょう。
            </Text>
          </VStack>
          <form action={onUpdateDetails} data-slot="details-form">
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
                <Button size="sm" type="submit" variant="default">
                  表示情報を保存
                </Button>
              </HStack>
            </VStack>
          </form>
        </VStack>
      </Box>

      <Box bg="card" p="lg" radius="lg" w="full">
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
          <Box bg="card" p="md" radius="md" w="full">
            <Text color="muted">まだ質問がありません。</Text>
          </Box>
        ) : (
          <VStack gap="md" w="full">
            {featureRequests.map((feature) => {
              const copy = statusCopy(feature.status);
              const title = feature.title?.trim() || "無題の質問";

              return (
                <Box
                  bg="card"
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
                        <Box
                          bg={feature.status === "open" ? "accent" : "muted"}
                          px="sm"
                          py="xs"
                          radius="full"
                        >
                          <Text
                            color={
                              feature.status === "open" ? "accent" : "muted"
                            }
                            size="xs"
                            weight="medium"
                          >
                            {copy.label}
                          </Text>
                        </Box>
                        <form
                          action={onUpdateFeatureStatus}
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
                          <Button size="sm" type="submit" variant="outline">
                            {copy.actionLabel}
                          </Button>
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
                        作成: {formatDateTime(feature.createdAt)}
                      </Text>
                      <Text color="subtle" size="xs">
                        更新: {formatDateTime(feature.updatedAt)}
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
