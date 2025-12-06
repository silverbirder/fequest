import { type AsChildProp, resolveSlotComponent } from "@repo/ui/lib/as-child";
import {
  splitStyleProps,
  type StyleProps,
  stylePropsClassNames,
} from "@repo/ui/lib/style-props";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const containerVariants = cva("mx-auto w-full", {
  defaultVariants: {
    padding: "md",
    size: "3xl",
  },
  variants: {
    padding: {
      lg: "px-6 sm:px-10 lg:px-12",
      md: "px-4 sm:px-6 lg:px-8",
      none: "px-0",
      sm: "px-2 sm:px-4",
    },
    size: {
      "2xl": "max-w-6xl",
      "3xl": "max-w-7xl",
      full: "max-w-none",
      lg: "max-w-4xl",
      md: "max-w-2xl",
      sm: "max-w-xl",
      xl: "max-w-5xl",
      xs: "max-w-lg",
    },
  },
});

type ContainerProps = AsChildProp &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof StyleProps> &
  StyleProps &
  VariantProps<typeof containerVariants> & {
    centerContent?: boolean;
  };

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      asChild = false,
      centerContent = false,
      className,
      padding,
      size,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveSlotComponent(asChild, "div");
    const { restProps, styleProps } = splitStyleProps(props);

    return (
      <Comp
        className={cn(
          containerVariants({ padding, size }),
          centerContent && "flex flex-col items-center text-center",
          stylePropsClassNames(styleProps),
          className,
        )}
        data-slot="container"
        ref={ref}
        {...restProps}
      />
    );
  },
);
Container.displayName = "Container";

export { Container, containerVariants };
export type { ContainerProps };
