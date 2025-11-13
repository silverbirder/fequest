import { Button, Heading, Text, VStack } from "@repo/ui/components";
import Form from "next/form";

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

const summarizeReactions = (reactions?: null | { emoji: string }[]) => {
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
  const description = "プロダクトに寄せられたフィーチャーリクエストです";
  const featureRequests = product.featureRequests ?? [];

  return (
    <VStack gap="xl">
      <VStack gap="lg">
        <Heading size="lg">{title}</Heading>
        <Text>{description}</Text>
        <Button variant="destructive">新しいフィーチャーをリクエスト</Button>
      </VStack>
      <VStack gap="lg">
        <Heading size="lg">フィーチャー一覧</Heading>
        {featureRequests.length === 0 ? (
          <p>フィーチャーはまだありません。</p>
        ) : (
          <VStack>
            {featureRequests.map((feature) => (
              <VStack key={feature.id}>
                <Text>{feature.content}</Text>
                <Form action={onReactToFeature}>
                  <input name="featureId" type="hidden" value={feature.id} />
                  <span>ステータス: {feature.status}</span>
                  <input name="emoji" type="hidden" value="👍" />
                  <input name="action" type="hidden" value="up" />
                  <button type="submit">👍 リアクション</button>
                </Form>
                <ReactionList
                  featureId={feature.id}
                  reactions={feature.reactions}
                />
              </VStack>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

type ReactionListProps = {
  featureId: number;
  reactions?: null | { emoji: string }[];
};

const ReactionList = ({ featureId, reactions }: ReactionListProps) => {
  const summaries = summarizeReactions(reactions);

  if (summaries.length === 0) {
    return (
      <VStack>
        <Text size="sm">リアクションはまだありません。</Text>
      </VStack>
    );
  }

  return (
    <VStack>
      {summaries.map(({ count, emoji }) => (
        <Text key={`${featureId}-${emoji}`} size="sm">
          {emoji} {count}
        </Text>
      ))}
    </VStack>
  );
};
