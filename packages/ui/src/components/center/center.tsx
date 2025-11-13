import { Slot } from "@radix-ui/react-slot";
import {
  splitStyleProps,
  type StyleProps,
  stylePropsClassNames,
} from "@repo/ui/lib/style-props";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const centerVariants = cva("flex items-center justify-center", {
  defaultVariants: {
    direction: "row",
    gap: "sm",
    inline: false,
  },
  variants: {
    direction: {
      column: "flex-col",
      row: "flex-row",
    },
    gap: {
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
  },
});

type CenterProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  keyof StyleProps
> &
  StyleProps &
  VariantProps<typeof centerVariants> & {
    asChild?: boolean;
  };

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ asChild = false, className, direction, gap, inline, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    const { restProps, styleProps } = splitStyleProps(props);

    return (
      <Comp
        className={cn(
          centerVariants({ direction, gap, inline }),
          stylePropsClassNames(styleProps),
          className,
        )}
        data-slot="center"
        ref={ref}
        {...restProps}
      />
    );
  },
);
Center.displayName = "Center";

export { Center, centerVariants };
export type { CenterProps };
