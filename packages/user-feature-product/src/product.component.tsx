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
  onLikeFeature?: (formData: FormData) => Promise<void>;
};

export const ProductComponent = ({ product, onLikeFeature }: Props) => {
  const title = product.name;
  const description = "プロダクトに寄せられたフィーチャーリクエストです";
  const featureRequests = product.featureRequests ?? [];

  return (
    <div className="space-y-6">
      <section
        data-slot="product-component"
        className="space-y-2 rounded-md border border-border/40 p-4 shadow-sm"
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">フィーチャー一覧</h2>
        {featureRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            フィーチャーはまだありません。
          </p>
        ) : (
          <ul className="space-y-3">
            {featureRequests.map((feature) => (
              <li
                key={feature.id}
                className="rounded-md border border-border/40 p-4 shadow-sm"
              >
                <p className="mb-3 whitespace-pre-line text-sm">
                  {feature.content}
                </p>
                <Form
                  action={(formData) => onLikeFeature?.(formData)}
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="featureId" value={feature.id} />
                  <button
                    type="submit"
                    className="rounded bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    いいね ({feature.likes})
                  </button>
                  <span className="text-xs text-muted-foreground">
                    ステータス: {feature.status}
                  </span>
                </Form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
