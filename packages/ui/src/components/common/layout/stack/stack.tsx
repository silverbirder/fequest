import {
  splitStyleProps,
  type StyleProps,
  stylePropsClassNames,
} from "@repo/ui/lib/style-props";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const stackVariants = cva("flex", {
  defaultVariants: {
    align: "stretch",
    direction: "column",
    gap: "md",
    inline: false,
    justify: "start",
    self: "stretch",
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
    self: {
      baseline: "self-baseline",
      center: "self-center",
      end: "self-end",
      start: "self-start",
      stretch: "self-stretch",
    },
    wrap: {
      nowrap: "flex-nowrap",
      wrap: "flex-wrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
  },
});

type StackProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof StyleProps> &
  StyleProps &
  VariantProps<typeof stackVariants>;

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    { align, className, direction, gap, inline, justify, self, wrap, ...props },
    ref,
  ) => {
    const orientation = direction ?? "column";
    const { restProps, styleProps } = splitStyleProps(props);

    return (
      <div
        className={cn(
          stackVariants({ align, direction, gap, inline, justify, self, wrap }),
          stylePropsClassNames(styleProps),
          className,
        )}
        data-orientation={orientation}
        data-slot="stack"
        ref={ref}
        {...restProps}
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
