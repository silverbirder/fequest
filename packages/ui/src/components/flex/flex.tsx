import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const flexVariants = cva("flex", {
  defaultVariants: {
    align: "stretch",
    direction: "row",
    gap: "sm",
    inline: false,
    justify: "start",
    wrap: "nowrap",
  },
  variants: {
    align: {
      baseline: "items-baseline",
      center: "items-center",
      end: "items-end",
      start: "items-start",
      stretch: "items-stretch",
    },
    direction: {
      column: "flex-col",
      "column-reverse": "flex-col-reverse",
      row: "flex-row",
      "row-reverse": "flex-row-reverse",
    },
    gap: {
      "2xl": "gap-10",
      lg: "gap-6",
      md: "gap-4",
      none: "gap-0",
      sm: "gap-2",
      xl: "gap-8",
      xs: "gap-1",
    },
    inline: {
      false: "",
      true: "inline-flex",
    },
    justify: {
      around: "justify-around",
      between: "justify-between",
      center: "justify-center",
      end: "justify-end",
      evenly: "justify-evenly",
      start: "justify-start",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
  },
});

type FlexProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof flexVariants> & {
    asChild?: boolean;
  };

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      align,
      asChild = false,
      className,
      direction,
      gap,
      inline,
      justify,
      wrap,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        className={cn(
          flexVariants({ align, direction, gap, inline, justify, wrap }),
          className,
        )}
        data-slot="flex"
        ref={ref}
        {...props}
      />
    );
  },
);
Flex.displayName = "Flex";

export { Flex, flexVariants };
export type { FlexProps };
