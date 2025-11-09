import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

import { cn } from "@repo/ui/lib/utils";

const textVariants = cva("text-foreground leading-normal block", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    casing: {
      none: undefined,
      uppercase: "uppercase tracking-wide",
      lowercase: "lowercase",
      capitalize: "capitalize",
    },
    color: {
      default: undefined,
      muted: "text-muted-foreground",
      subtle: "text-foreground/80",
      accent: "text-primary",
      destructive: "text-destructive",
    },
    truncate: {
      true: "truncate",
    },
    display: {
      block: "block",
      inline: "inline",
      "inline-block": "inline-block",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "normal",
    align: "left",
    casing: "none",
    color: "default",
    display: "block",
  },
});

type TextProps = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof textVariants> & {
    asChild?: boolean;
  };

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      className,
      size,
      weight,
      align,
      casing,
      color,
      truncate,
      display,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        data-slot="text"
        className={cn(
          textVariants({
            size,
            weight,
            align,
            casing,
            color,
            truncate,
            display,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, textVariants };
export type { TextProps };
