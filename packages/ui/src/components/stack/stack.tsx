import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/lib/utils";
import React from "react";

const stackVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    spacing: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-10",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
    inline: {
      false: undefined,
      true: "inline-flex",
    },
  },
  defaultVariants: {
    direction: "column",
    align: "stretch",
    justify: "start",
    spacing: "md",
    wrap: "nowrap",
    inline: false,
  },
});

type StackProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof stackVariants>;

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { className, direction, spacing, align, justify, wrap, inline, ...props },
    ref,
  ) => {
    const orientation = direction ?? "column";

    return (
      <div
        ref={ref}
        data-slot="stack"
        data-orientation={orientation}
        className={cn(
          stackVariants({ direction, spacing, align, justify, wrap, inline }),
          className,
        )}
        {...props}
      />
    );
  },
);
Stack.displayName = "Stack";

type HStackProps = Omit<StackProps, "direction">;

const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ align = "center", ...props }, ref) => (
    <Stack ref={ref} direction="row" align={align} {...props} />
  ),
);
HStack.displayName = "HStack";

type VStackProps = Omit<StackProps, "direction">;

const VStack = React.forwardRef<HTMLDivElement, VStackProps>(
  ({ align = "start", ...props }, ref) => (
    <Stack ref={ref} direction="column" align={align} {...props} />
  ),
);
VStack.displayName = "VStack";

export { Stack, HStack, VStack, stackVariants };
export type { StackProps, HStackProps, VStackProps };
