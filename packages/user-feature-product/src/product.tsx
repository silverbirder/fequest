import {
  BubbleInput,
  Heading,
  HStack,
  Text,
  VStack,
} from "@repo/ui/components";
import Form from "next/form";

import type { ReactionSummary } from "./libs/reaction-summary";

import { FeatureRequestItem } from "./components/feature-request-item";

type FeatureRequest = {
  content: string;
  id: number;
  reactionSummaries?: null | ReactionSummary[];
  status: string;
  title?: null | string;
};

type Product = {
  featureRequests?: FeatureRequest[] | null;
  id: number;
  name: string;
};

type Props = {
  canCreateFeatureRequest: boolean;
  onCreateFeatureRequest: (formData: FormData) => Promise<void>;
  onReactToFeature: (formData: FormData) => Promise<void>;
  product: Product;
};

const getAvatarFallbackText = (text: string) => {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return "FR";
  }

  return trimmed.slice(0, 2).toUpperCase();
};

export const Product = ({
  canCreateFeatureRequest,
  onCreateFeatureRequest,
  onReactToFeature,
  product,
}: Props) => {
  const title = product.name;
  const featureRequests = product.featureRequests ?? [];

  return (
    <VStack gap="xl">
      <Heading size="lg">{title}</Heading>
      <VStack gap="lg">
        {featureRequests.length === 0 ? (
          <Text>フィーチャーはまだありません。</Text>
        ) : (
          <HStack align="start" gap="lg">
            {featureRequests.map((feature) => {
              const text = feature.title?.trim() ?? "";
              return (
                <FeatureRequestItem
                  avatarFallbackText={getAvatarFallbackText(text)}
                  featureId={feature.id}
                  key={feature.id}
                  onReactToFeature={onReactToFeature}
                  reactions={feature.reactionSummaries ?? []}
                  text={text}
                />
              );
            })}
          </HStack>
        )}
      </VStack>
      {canCreateFeatureRequest ? (
        <Form action={onCreateFeatureRequest} className="w-full">
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
