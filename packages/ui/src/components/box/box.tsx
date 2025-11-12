import { Slot } from "@radix-ui/react-slot";
import {
  splitStyleProps,
  type StyleProps,
  stylePropsClassNames,
} from "@repo/ui/lib/style-props";
import { cn } from "@repo/ui/lib/utils";
import React from "react";

type BoxProps = Omit<React.ComponentPropsWithoutRef<"div">, keyof StyleProps> &
  StyleProps & {
    asChild?: boolean;
  };

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ asChild = false, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
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
