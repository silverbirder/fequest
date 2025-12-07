import { type ProductSummary } from "@repo/type";
import { HStack, ProductCard } from "@repo/ui/components";

type Props = {
  products: ProductSummary[];
};

export const Top = ({ products }: Props) => {
  return (
    <HStack gap="md" wrap="wrap">
      {products.map((product) => (
        <ProductCard
          href={{ pathname: `/${product.id}` }}
          key={product.id}
          logoUrl={product.logoUrl}
          name={product.name}
          requestCount={product.featureCount}
        />
      ))}
    </HStack>
  );
};
