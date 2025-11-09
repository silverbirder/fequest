import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React, { type ElementType } from "react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingVariants = cva("text-foreground tracking-tight", {
  defaultVariants: {
    align: "left",
    size: "3xl",
    weight: "bold",
  },
  variants: {
    align: {
      center: "text-center",
      justify: "text-justify",
      left: "text-left",
      right: "text-right",
    },
    size: {
      "2xl": "text-2xl leading-snug",
      "3xl": "text-3xl leading-tight",
      "4xl": "text-4xl leading-tight",
      "5xl": "text-5xl leading-tight",
      lg: "text-lg leading-snug",
      xl: "text-xl leading-snug",
    },
    truncate: {
      true: "truncate",
    },
    underline: {
      true: "underline underline-offset-8",
    },
    weight: {
      bold: "font-bold",
      extrabold: "font-extrabold",
      medium: "font-medium",
      regular: "font-normal",
      semibold: "font-semibold",
    },
  },
});

type HeadingSize = NonNullable<VariantProps<typeof headingVariants>["size"]>;

const sizeByLevel: Record<HeadingLevel, HeadingSize> = {
  1: "5xl",
  2: "4xl",
  3: "3xl",
  4: "2xl",
  5: "xl",
  6: "lg",
};

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    asChild?: boolean;
    level?: HeadingLevel;
  };

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      align,
      asChild = false,
      className,
      level = 2,
      size,
      truncate,
      underline,
      weight,
      ...props
    },
    ref,
  ) => {
    const Component: ElementType = asChild ? Slot : (`h${level}` as const);
    const computedSize = size ?? sizeByLevel[level] ?? "3xl";

    return (
      <Component
        className={cn(
          headingVariants({
            align,
            size: computedSize,
            truncate,
            underline,
            weight,
          }),
          className,
        )}
        data-level={level}
        data-slot="heading"
        ref={ref}
        {...props}
      />
    );
  },
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
export type { HeadingLevel, HeadingProps };
