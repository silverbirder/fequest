import { type FeatureRequestCore, type FeatureRequestUser } from "@repo/type";
import {
  Box,
  BubbleInput,
  Heading,
  HStack,
  ProductLogo,
  Text,
  VStack,
} from "@repo/ui/components";
import { toIsoString } from "@repo/util";
import Form from "next/form";

import type { ReactionSummary } from "./libs/reaction-summary";

import { FeatureRequestContent } from "./components/feature-request-content";
import { FeatureRequestItem } from "./components/feature-request-item";

type FeatureRequest = FeatureRequestCore & {
  reactionSummaries?: null | ReactionSummary[];
  user?: FeatureRequestUser | null;
};

type ProductData = {
  description?: null | string;
  featureRequests?: FeatureRequest[] | null;
  id: number;
  logoUrl?: null | string;
  name: string;
};

type Props = {
  canCreateFeatureRequest: boolean;
  currentUserId?: null | string;
  onCreateFeatureRequest: (formData: FormData) => Promise<void>;
  onReactToFeature: (formData: FormData) => Promise<void>;
  openFeatureRequestId?: null | number;
  product: ProductData;
};

export const Product = (props: Props) => {
  const featureRequests: FeatureRequest[] = props.product.featureRequests ?? [];
  const openFeatureRequests = featureRequests.filter(
    (feature) => feature.status !== "closed",
  );
  const closedFeatureRequests = featureRequests.filter(
    (feature) => feature.status === "closed",
  );
  const description = props.product.description?.trim() ?? "";
  const logoUrl = props.product.logoUrl?.trim() || null;

  const renderFeatureRequest = (feature: FeatureRequest) => {
    const isOwner =
      Boolean(props.currentUserId) &&
      Boolean(feature.user?.id) &&
      feature.user?.id === props.currentUserId;
    const text = feature.title?.trim() ?? "";
    const isOpenTarget =
      typeof props.openFeatureRequestId === "number" &&
      props.openFeatureRequestId === feature.id;

    return (
      <FeatureRequestItem
        avatar={feature.user}
        defaultOpen={isOpenTarget}
        detail={{
          content: <FeatureRequestContent content={feature.content ?? ""} />,
          createdAt: toIsoString(feature.createdAt),
          title: text,
          updatedAt: toIsoString(feature.updatedAt),
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
        text={text}
      />
    );
  };

  return (
    <VStack gap="xl">
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
            <Heading size="lg">{props.product.name}</Heading>
            {description ? <Text color="muted">{description}</Text> : null}
          </VStack>
        </HStack>
      </VStack>
      {openFeatureRequests.length === 0 ? (
        <Text>
          {closedFeatureRequests.length === 0
            ? "フィーチャーはまだありません。"
            : "オープンのフィーチャーはありません。"}
        </Text>
      ) : (
        <VStack align="start" gap="lg">
          {openFeatureRequests.map(renderFeatureRequest)}
        </VStack>
      )}
      {props.canCreateFeatureRequest ? (
        <Box asChild w="full">
          <Form action={props.onCreateFeatureRequest}>
            <BubbleInput
              aria-label="新しいフィーチャーリクエスト"
              autoComplete="off"
              maxLength={255}
              name="title"
              required
            />
          </Form>
        </Box>
      ) : (
        <Text>ログインするとフィーチャーを登録できます。</Text>
      )}
      {closedFeatureRequests.length > 0 && (
        <VStack align="start" gap="lg">
          {closedFeatureRequests.map(renderFeatureRequest)}
        </VStack>
      )}
    </VStack>
  );
};
