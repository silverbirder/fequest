import { Heading, HStack, Text, VStack } from "@repo/ui/components";

import type { ReactionSummary } from "./libs/reaction-summary";

import { FeatureRequestItem } from "./components/feature-request-item";

type FeatureRequest = {
  content: string;
  id: number;
  reactionSummaries?: null | ReactionSummary[];
  status: string;
};

type Product = {
  featureRequests?: FeatureRequest[] | null;
  id: number;
  name: string;
};

type Props = {
  onReactToFeature: (formData: FormData) => Promise<void>;
  product: Product;
};

const getAvatarFallbackText = (content: string) => {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return "FR";
  }

  return trimmed.slice(0, 2).toUpperCase();
};

export const Product = ({ onReactToFeature, product }: Props) => {
  const title = product.name;
  const featureRequests = product.featureRequests ?? [];

  return (
    <VStack gap="xl">
      <Heading size="lg">{title}</Heading>
      <VStack gap="lg">
        <Heading size="lg">フィーチャー一覧</Heading>
        {featureRequests.length === 0 ? (
          <Text>フィーチャーはまだありません。</Text>
        ) : (
          <HStack align="start" gap="lg">
            {featureRequests.map((feature) => (
              <FeatureRequestItem
                avatarFallbackText={getAvatarFallbackText(feature.content)}
                featureId={feature.id}
                key={feature.id}
                onReactToFeature={onReactToFeature}
                reactions={feature.reactionSummaries ?? []}
                text={feature.content}
              />
            ))}
          </HStack>
        )}
      </VStack>
    </VStack>
  );
};
