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
    <div>
      <section>
        <h2>{title}</h2>
        <p>{description}</p>
      </section>
      <section>
        <h2>フィーチャー一覧</h2>
        {featureRequests.length === 0 ? (
          <p>フィーチャーはまだありません。</p>
        ) : (
          <ul>
            {featureRequests.map((feature) => (
              <li key={feature.id}>
                <p>{feature.content}</p>
                <Form action={onLikeFeature}>
                  <input type="hidden" name="featureId" value={feature.id} />
                  <button type="submit">いいね ({feature.likes})</button>
                  <span>ステータス: {feature.status}</span>
                </Form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
