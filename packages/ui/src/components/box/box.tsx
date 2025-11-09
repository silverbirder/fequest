import { Slot } from "@radix-ui/react-slot";
import { cn } from "@repo/ui/lib/utils";
import React from "react";

type BoxProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
};

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp className={cn(className)} data-slot="box" ref={ref} {...props} />
    );
  },
);
Box.displayName = "Box";

export { Box };
export type { BoxProps };
