import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const centerVariants = cva("flex items-center justify-center", {
  defaultVariants: {
    direction: "row",
    inline: false,
    spacing: "sm",
  },
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
    inline: {
      false: "",
      true: "inline-flex",
    },
    spacing: {
      lg: "gap-6",
      md: "gap-4",
      none: "gap-0",
      sm: "gap-2",
      xl: "gap-8",
      xs: "gap-1",
    },
  },
});

type CenterProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof centerVariants> & {
    asChild?: boolean;
  };

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  (
    { asChild = false, className, direction, inline, spacing, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        className={cn(
          centerVariants({ direction, inline, spacing }),
          className,
        )}
        data-slot="center"
        ref={ref}
        {...props}
      />
    );
  },
);
Center.displayName = "Center";

export { Center, centerVariants };
export type { CenterProps };
