import { type AsChildProp, resolveSlotComponent } from "@repo/ui/lib/as-child";
import {
  splitStyleProps,
  type StyleProps,
  stylePropsClassNames,
} from "@repo/ui/lib/style-props";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const textVariants = cva("text-foreground leading-normal block", {
  defaultVariants: {
    align: "left",
    casing: "none",
    color: "default",
    display: "block",
    size: "md",
    weight: "normal",
  },
  variants: {
    align: {
      center: "text-center",
      justify: "text-justify",
      left: "text-left",
      right: "text-right",
    },
    casing: {
      capitalize: "capitalize",
      lowercase: "lowercase",
      none: undefined,
      uppercase: "uppercase tracking-wide",
    },
    color: {
      accent: "text-primary",
      default: undefined,
      destructive: "text-destructive",
      muted: "text-muted-foreground",
      subtle: "text-foreground/80",
    },
    display: {
      block: "block",
      inline: "inline",
      "inline-block": "inline-block",
    },
    size: {
      "2xl": "text-2xl",
      lg: "text-lg",
      md: "text-base",
      sm: "text-sm",
      xl: "text-xl",
      xs: "text-xs",
    },
    truncate: {
      true: "truncate",
    },
    weight: {
      bold: "font-bold",
      light: "font-light",
      medium: "font-medium",
      normal: "font-normal",
      semibold: "font-semibold",
    },
  },
});

type TextProps = AsChildProp &
  Omit<React.ComponentPropsWithoutRef<"span">, keyof StyleProps> &
  StyleProps &
  VariantProps<typeof textVariants>;

const Text = React.forwardRef<HTMLSpanElement, TextProps>(
  (
    {
      align,
      asChild = false,
      casing,
      className,
      color,
      display,
      size,
      truncate,
      weight,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveSlotComponent(asChild, "span");
    const { restProps, styleProps } = splitStyleProps(props);

    return (
      <Comp
        className={cn(
          textVariants({
            align,
            casing,
            color,
            display,
            size,
            truncate,
            weight,
          }),
          stylePropsClassNames(styleProps),
          className,
        )}
        data-slot="text"
        ref={ref}
        {...restProps}
      />
    );
  },
);
Text.displayName = "Text";

export { Text, textVariants };
export type { TextProps };
