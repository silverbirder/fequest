import { ProductComponent } from "./product.component";

export const ProductContainer = () => {
  const title = "Product";
  const description = "Product feature placeholder";

  return <ProductComponent title={title} description={description} />;
};
