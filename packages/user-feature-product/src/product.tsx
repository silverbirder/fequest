import { Button, Heading, Text, VStack } from "@repo/ui/components";
import Form from "next/form";

type FeatureRequest = {
  id: number;
  content: string;
  likes: number;
  status: string;
};

type Product = {
  id: number;
  name: string;
  featureRequests?: FeatureRequest[] | null;
};

type Props = {
  product: Product;
  onLikeFeature: (formData: FormData) => Promise<void>;
};

export const Product = ({ product, onLikeFeature }: Props) => {
  const title = product.name;
  const description = "プロダクトに寄せられたフィーチャーリクエストです";
  const featureRequests = product.featureRequests ?? [];

  return (
    <VStack spacing="xl">
      <VStack spacing="lg">
        <Heading size="lg">{title}</Heading>
        <Text>{description}</Text>
        <Button variant="destructive">新しいフィーチャーをリクエスト</Button>
      </VStack>
      <VStack spacing="lg">
        <Heading size="lg">フィーチャー一覧</Heading>
        {featureRequests.length === 0 ? (
          <p>フィーチャーはまだありません。</p>
        ) : (
          <VStack>
            {featureRequests.map((feature) => (
              <VStack key={feature.id}>
                <Text>{feature.content}</Text>
                <Form action={onLikeFeature}>
                  <input type="hidden" name="featureId" value={feature.id} />
                  <button type="submit">いいね ({feature.likes})</button>
                  <span>ステータス: {feature.status}</span>
                </Form>
              </VStack>
            ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};
