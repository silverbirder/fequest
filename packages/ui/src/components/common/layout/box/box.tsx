import { type AsChildProp, resolveSlotComponent } from "@repo/ui/lib/as-child";
import {
  splitStyleProps,
  type StyleProps,
  stylePropsClassNames,
} from "@repo/ui/lib/style-props";
import { cn } from "@repo/ui/lib/utils";
import React from "react";

type BoxProps = AsChildProp &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof StyleProps> &
  StyleProps;

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = resolveSlotComponent(asChild, "div");
    const { restProps, styleProps } = splitStyleProps(props);

    return (
      <Comp
        className={cn(stylePropsClassNames(styleProps), className)}
        data-slot="box"
        ref={ref}
        {...restProps}
      />
    );
  },
);
Box.displayName = "Box";

export { Box };
export type { BoxProps };
