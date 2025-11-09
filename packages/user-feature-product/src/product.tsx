import { Button, Heading, Text, VStack } from "@repo/ui/components";
import Form from "next/form";

type FeatureRequest = {
  content: string;
  id: number;
  likes: number;
  status: string;
};

type Product = {
  featureRequests?: FeatureRequest[] | null;
  id: number;
  name: string;
};

type Props = {
  onLikeFeature: (formData: FormData) => Promise<void>;
  product: Product;
};

export const Product = ({ onLikeFeature, product }: Props) => {
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
                  <input name="featureId" type="hidden" value={feature.id} />
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
