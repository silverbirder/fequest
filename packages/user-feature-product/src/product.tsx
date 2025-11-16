import { Heading, HStack, Text, VStack } from "@repo/ui/components";

import {
  FeatureRequestItem,
  type ReactionSummary,
} from "./feature-request-item";

type FeatureRequest = {
  content: string;
  id: number;
  reactions?: null | { emoji: string }[];
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

const summarizeReactions = (
  reactions?: null | { emoji: string }[],
): ReactionSummary[] => {
  if (!reactions || reactions.length === 0) {
    return [];
  }

  const totals = new Map<string, number>();
  for (const reaction of reactions) {
    totals.set(reaction.emoji, (totals.get(reaction.emoji) ?? 0) + 1);
  }

  return Array.from(totals.entries()).map(([emoji, count]) => ({
    count,
    emoji,
  }));
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
                reactions={summarizeReactions(feature.reactions)}
                text={feature.content}
              />
            ))}
          </HStack>
        )}
      </VStack>
    </VStack>
  );
};
