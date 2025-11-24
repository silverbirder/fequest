import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@repo/ui/components";

type FeatureRequest = {
  content: string;
  createdAt?: Date | null | string;
  id: number;
  status: FeatureRequestStatus;
  title?: null | string;
  updatedAt?: Date | null | string;
};

type FeatureRequestStatus = "closed" | "open";

type ProductDetail = {
  featureRequests?: FeatureRequest[];
  id: number;
  name: string;
};

type Props = {
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
          プロダクト名の更新と、質問のステータス管理を行えます。
        </Text>
      </VStack>

      <Box bg="card" p="lg" radius="lg" w="full">
        <VStack align="start" gap="sm" w="full">
          <Text size="sm" weight="semibold">
            プロダクト名
          </Text>
          <form
            action={onUpdateName}
            data-slot="rename-form"
            style={{ width: "100%" }}
          >
            <input name="productId" type="hidden" value={product.id} />
            <HStack align="center" gap="sm" justify="start" wrap="wrap">
              <Box style={{ flex: "1 1 240px" }}>
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
                  key={feature.id}
                  p="md"
                  radius="md"
                  style={{ border: "1px solid rgba(0,0,0,0.04)" }}
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
                          bg={
                            feature.status === "open"
                              ? "primary-subtle"
                              : "gray-100"
                          }
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
