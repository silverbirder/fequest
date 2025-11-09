import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const stackVariants = cva("flex", {
  defaultVariants: {
    align: "stretch",
    direction: "column",
    inline: false,
    justify: "start",
    spacing: "md",
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
      row: "flex-row",
    },
    inline: {
      false: undefined,
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
    spacing: {
      "2xl": "gap-10",
      lg: "gap-6",
      md: "gap-4",
      none: "gap-0",
      sm: "gap-2",
      xl: "gap-8",
      xs: "gap-1",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
  },
});

type StackProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof stackVariants>;

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { align, className, direction, inline, justify, spacing, wrap, ...props },
    ref,
  ) => {
    const orientation = direction ?? "column";

    return (
      <div
        className={cn(
          stackVariants({ align, direction, inline, justify, spacing, wrap }),
          className,
        )}
        data-orientation={orientation}
        data-slot="stack"
        ref={ref}
        {...props}
      />
    );
  },
);
Stack.displayName = "Stack";

type HStackProps = Omit<StackProps, "direction">;

const HStack = React.forwardRef<HTMLDivElement, HStackProps>(
  ({ align = "center", ...props }, ref) => (
    <Stack align={align} direction="row" ref={ref} {...props} />
  ),
);
HStack.displayName = "HStack";

type VStackProps = Omit<StackProps, "direction">;

const VStack = React.forwardRef<HTMLDivElement, VStackProps>(
  ({ align = "start", ...props }, ref) => (
    <Stack align={align} direction="column" ref={ref} {...props} />
  ),
);
VStack.displayName = "VStack";

export { HStack, Stack, stackVariants, VStack };
export type { HStackProps, StackProps, VStackProps };
