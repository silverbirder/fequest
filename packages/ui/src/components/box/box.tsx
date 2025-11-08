import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@repo/ui/lib/utils";

type BoxProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean;
};

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp ref={ref} data-slot="box" className={cn(className)} {...props} />
    );
  },
);
Box.displayName = "Box";

export { Box };
export type { BoxProps };
