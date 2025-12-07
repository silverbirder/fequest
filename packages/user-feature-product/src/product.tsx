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
  onDeleteFeatureRequest?: (formData: FormData) => Promise<void>;
  onReactToFeature: (formData: FormData) => Promise<void>;
  onUpdateFeatureRequest?: (formData: FormData) => Promise<void>;
  openFeatureRequestId?: null | number;
  product: ProductData;
};

export const Product = (props: Props) => {
  const featureRequests: FeatureRequest[] = props.product.featureRequests ?? [];
  const description = props.product.description?.trim() ?? "";
  const logoUrl = props.product.logoUrl?.trim() || null;

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
      <VStack gap="lg">
        {featureRequests.length === 0 ? (
          <Text>フィーチャーはまだありません。</Text>
        ) : (
          <VStack align="start" gap="lg">
            {featureRequests.map((feature) => {
              const isOwner =
                Boolean(props.currentUserId) &&
                Boolean(feature.user?.id) &&
                feature.user?.id === props.currentUserId;
              const canDelete = Boolean(
                props.onDeleteFeatureRequest && isOwner,
              );
              const isOpenTarget =
                typeof props.openFeatureRequestId === "number" &&
                props.openFeatureRequestId === feature.id;
              const text = feature.title?.trim() ?? "";
              return (
                <FeatureRequestItem
                  avatar={feature.user}
                  canDelete={canDelete}
                  defaultOpen={isOpenTarget}
                  detail={{
                    content: (
                      <FeatureRequestContent
                        content={feature.content}
                        featureId={feature.id}
                        isOwner={isOwner}
                        onUpdateFeatureRequest={props.onUpdateFeatureRequest}
                      />
                    ),
                    createdAt: toIsoString(feature.createdAt),
                    title: text,
                    updatedAt: toIsoString(feature.updatedAt),
                  }}
                  featureId={feature.id}
                  key={feature.id}
                  onDeleteFeatureRequest={
                    canDelete ? props.onDeleteFeatureRequest : undefined
                  }
                  onReactToFeature={props.onReactToFeature}
                  reactions={feature.reactionSummaries ?? []}
                  text={text}
                />
              );
            })}
          </VStack>
        )}
      </VStack>
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
    </VStack>
  );
};
