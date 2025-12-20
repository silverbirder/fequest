import { type FeatureRequestCore, type FeatureRequestUser } from "@repo/type";
import {
  Box,
  Heading,
  HStack,
  ProductLogo,
  RequestInput,
  Text,
  VStack,
} from "@repo/ui/components";
import { Home } from "lucide-react";
import Form from "next/form";

import type { ReactionSummary } from "./libs";

import { FeatureRequestContent, FeatureRequestItem } from "./components";

type FeatureRequest = FeatureRequestCore & {
  reactionSummaries?: null | ReactionSummary[];
  user?: FeatureRequestUser | null;
};

export const FEATURE_CONTENT_FALLBACK = "詳細はありません。";

type ProductData = {
  description?: null | string;
  featureRequests?: FeatureRequest[] | null;
  homePageUrl?: null | string;
  id: number;
  logoUrl?: null | string;
  name: string;
};

type Props = {
  canCreateFeatureRequest: boolean;
  currentUser?: FeatureRequestUser | null;
  onCreateFeatureRequest: (formData: FormData) => Promise<void>;
  onReactToFeature: (formData: FormData) => Promise<void>;
  openFeatureRequestId?: null | number;
  product: ProductData;
};

const toTimestamp = (value: FeatureRequestCore["createdAt"]) => {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }

  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
};

const getReactionCount = (feature: FeatureRequest) =>
  (feature.reactionSummaries ?? []).reduce(
    (total, reaction) => total + reaction.count,
    0,
  );

const sortFeatureRequests = (features: FeatureRequest[]) =>
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

export const Product = (props: Props) => {
  const featureRequests: FeatureRequest[] = props.product.featureRequests ?? [];
  const currentUserId = props.currentUser?.id ?? null;
  const sortedFeatureRequests = sortFeatureRequests(featureRequests);
  const openFeatureRequests = sortedFeatureRequests.filter(
    (feature) => feature.status !== "closed",
  );
  const closedFeatureRequests = sortedFeatureRequests.filter(
    (feature) => feature.status === "closed",
  );
  const description = props.product.description?.trim() ?? "";
  const logoUrl = props.product.logoUrl?.trim() || null;
  const homePageUrl = props.product.homePageUrl?.trim() || null;
  const currentUserAvatar = props.currentUser ?? null;

  const renderFeatureRequest = (feature: FeatureRequest) => {
    const isOwner =
      Boolean(currentUserId) &&
      Boolean(feature.user?.id) &&
      feature.user?.id === currentUserId;
    const text = feature.title?.trim() ?? "";
    const content = feature.content?.trim() ?? "";
    const detailContent = content || FEATURE_CONTENT_FALLBACK;
    const isOpenTarget =
      typeof props.openFeatureRequestId === "number" &&
      props.openFeatureRequestId === feature.id;
    return (
      <FeatureRequestItem
        avatar={feature.user}
        defaultOpen={isOpenTarget}
        detail={{
          content: <FeatureRequestContent content={detailContent} />,
          createdAt: feature.createdAt,
          title: text,
          updatedAt: feature.updatedAt,
        }}
        editHref={
          isOwner
            ? { pathname: `/${props.product.id}/${feature.id}/edit` }
            : undefined
        }
        featureId={feature.id}
        key={feature.id}
        onReactToFeature={props.onReactToFeature}
        reactions={feature.reactionSummaries ?? []}
        status={feature.status === "closed" ? "closed" : "open"}
        text={text}
      />
    );
  };

  return (
    <VStack gap="xl" w="full">
      <VStack align="start" gap="md">
        <Box w="logo">
          <ProductLogo
            logoUrl={logoUrl}
            name={props.product.name}
            sizes="72px"
          />
        </Box>
        <HStack align="start" gap="md" w="full">
          <VStack align="start" gap="xs" w="full">
            <HStack align="end" gap="md" wrap="wrap">
              <Heading size="lg">{props.product.name}</Heading>
              {homePageUrl && (
                <Text
                  asChild
                  color="accent"
                  display="inline"
                  size="sm"
                  weight="bold"
                >
                  <a
                    href={homePageUrl}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    <HStack align="center" gap="xs" inline>
                      <Home size={16} />
                      <span>公式サイト</span>
                    </HStack>
                  </a>
                </Text>
              )}
            </HStack>
            {description ? <Text color="muted">{description}</Text> : null}
          </VStack>
        </HStack>
      </VStack>
      {openFeatureRequests.length === 0 ? (
        <Text>リクエストはまだありません。</Text>
      ) : (
        <VStack align="start" gap="lg">
          {openFeatureRequests.map(renderFeatureRequest)}
        </VStack>
      )}
      {props.canCreateFeatureRequest ? (
        <Box asChild w="full">
          <Form action={props.onCreateFeatureRequest}>
            <RequestInput
              aria-label="新しいリクエスト"
              autoComplete="off"
              avatar={currentUserAvatar ?? undefined}
              maxLength={255}
              name="title"
              required
            />
          </Form>
        </Box>
      ) : (
        <Text>ログインするとリクエストを投稿できます。</Text>
      )}
      {closedFeatureRequests.length > 0 && (
        <VStack align="start" gap="lg">
          {closedFeatureRequests.map(renderFeatureRequest)}
        </VStack>
      )}
    </VStack>
  );
};
