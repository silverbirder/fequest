import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/lib/utils";
import React from "react";

const centerVariants = cva("flex items-center justify-center", {
  variants: {
    inline: {
      false: "",
      true: "inline-flex",
    },
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    spacing: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
  defaultVariants: {
    inline: false,
    direction: "row",
    spacing: "sm",
  },
});

type CenterProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof centerVariants> & {
    asChild?: boolean;
  };

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  (
    { className, inline, direction, spacing, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-slot="center"
        className={cn(
          centerVariants({ inline, direction, spacing }),
          className,
        )}
        {...props}
      />
    );
  },
);
Center.displayName = "Center";

export { Center, centerVariants };
export type { CenterProps };
