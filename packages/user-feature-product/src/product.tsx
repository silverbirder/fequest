import {
  BubbleInput,
  Heading,
  HStack,
  MdxContent,
  Text,
  VStack,
} from "@repo/ui/components";
import Form from "next/form";

import type { ReactionSummary } from "./libs/reaction-summary";

import { FeatureRequestItem } from "./components/feature-request-item";

type FeatureRequest = {
  content: string;
  createdAt?: Date | null | string;
  id: number;
  reactionSummaries?: null | ReactionSummary[];
  status: string;
  title?: null | string;
  updatedAt?: Date | null | string;
  user?: null | {
    id?: null | string;
    image?: null | string;
    name?: null | string;
  };
};

type ProductData = {
  featureRequests?: FeatureRequest[] | null;
  id: number;
  name: string;
};

type Props = {
  canCreateFeatureRequest: boolean;
  currentUserId?: null | string;
  onCreateFeatureRequest: (formData: FormData) => Promise<void>;
  onDeleteFeatureRequest?: (formData: FormData) => Promise<void>;
  onReactToFeature: (formData: FormData) => Promise<void>;
  product: ProductData;
};

const getAvatarFallbackText = (text?: null | string) => {
  const trimmed = (text ?? "").trim();
  if (trimmed.length === 0) {
    return "FR";
  }

  return trimmed.slice(0, 2).toUpperCase();
};

const createAvatarProps = (feature: FeatureRequest) => {
  const referenceText = feature.user?.name ?? feature.title ?? feature.content;
  return {
    alt: feature.user?.name ?? undefined,
    fallbackText: getAvatarFallbackText(referenceText),
    src: feature.user?.image ?? undefined,
  };
};

const toIsoString = (value?: Date | null | string) => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

export const Product = (props: Props) => {
  const featureRequests: FeatureRequest[] = props.product.featureRequests ?? [];

  return (
    <VStack gap="xl">
      <Heading size="lg">{props.product.name}</Heading>
      <VStack gap="lg">
        {featureRequests.length === 0 ? (
          <Text>フィーチャーはまだありません。</Text>
        ) : (
          <HStack align="start" gap="lg">
            {featureRequests.map((feature) => {
              const isOwner =
                Boolean(props.currentUserId) &&
                Boolean(feature.user?.id) &&
                feature.user?.id === props.currentUserId;
              const canDelete = Boolean(
                props.onDeleteFeatureRequest && isOwner,
              );
              const text = feature.title?.trim() ?? "";
              return (
                <FeatureRequestItem
                  avatar={createAvatarProps(feature)}
                  canDelete={canDelete}
                  detail={{
                    content: <MdxContent source={feature.content} />,
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
          </HStack>
        )}
      </VStack>
      {props.canCreateFeatureRequest ? (
        <Form action={props.onCreateFeatureRequest} className="w-full">
          <BubbleInput
            aria-label="新しいフィーチャーリクエスト"
            autoComplete="off"
            maxLength={255}
            name="title"
            required
          />
        </Form>
      ) : (
        <Text>ログインするとフィーチャーを登録できます。</Text>
      )}
    </VStack>
  );
};
