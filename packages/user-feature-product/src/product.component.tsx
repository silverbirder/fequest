type ProductComponentProps = {
  title: string;
  description: string;
};

export const ProductComponent = ({
  title,
  description,
}: ProductComponentProps) => {
  return (
    <section
      data-slot="product-component"
      className="space-y-2 rounded-md border border-border/40 p-4 shadow-sm"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </section>
  );
};

export type { ProductComponentProps };
