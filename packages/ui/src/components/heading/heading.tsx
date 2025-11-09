import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React, { type ElementType } from "react";

import { cn } from "@repo/ui/lib/utils";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const headingVariants = cva("text-foreground tracking-tight", {
  variants: {
    size: {
      "5xl": "text-5xl leading-tight",
      "4xl": "text-4xl leading-tight",
      "3xl": "text-3xl leading-tight",
      "2xl": "text-2xl leading-snug",
      xl: "text-xl leading-snug",
      lg: "text-lg leading-snug",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    underline: {
      true: "underline underline-offset-8",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    size: "3xl",
    weight: "bold",
    align: "left",
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
    level?: HeadingLevel;
    asChild?: boolean;
  };

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      level = 2,
      asChild = false,
      className,
      size,
      weight,
      align,
      underline,
      truncate,
      ...props
    },
    ref,
  ) => {
    const Component: ElementType = asChild ? Slot : (`h${level}` as const);
    const computedSize = size ?? sizeByLevel[level] ?? "3xl";

    return (
      <Component
        ref={ref}
        data-slot="heading"
        data-level={level}
        className={cn(
          headingVariants({
            size: computedSize,
            weight,
            align,
            underline,
            truncate,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);
Heading.displayName = "Heading";

export { Heading, headingVariants };
export type { HeadingProps, HeadingLevel };
