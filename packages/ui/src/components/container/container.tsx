import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/lib/utils";
import React from "react";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      xs: "max-w-lg",
      sm: "max-w-xl",
      md: "max-w-2xl",
      lg: "max-w-4xl",
      xl: "max-w-5xl",
      "2xl": "max-w-6xl",
      "3xl": "max-w-7xl",
      full: "max-w-none",
    },
    padding: {
      none: "px-0",
      sm: "px-2 sm:px-4",
      md: "px-4 sm:px-6 lg:px-8",
      lg: "px-6 sm:px-10 lg:px-12",
    },
  },
  defaultVariants: {
    size: "3xl",
    padding: "md",
  },
});

type ContainerProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof containerVariants> & {
    centerContent?: boolean;
  };

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, centerContent = false, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="container"
      className={cn(
        containerVariants({ size, padding }),
        centerContent && "flex flex-col items-center text-center",
        className,
      )}
      {...props}
    />
  ),
);
Container.displayName = "Container";

export { Container, containerVariants };
export type { ContainerProps };
