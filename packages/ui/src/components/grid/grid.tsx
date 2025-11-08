import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@repo/ui/lib/utils";
import React from "react";

const gridVariants = cva("grid", {
  variants: {
    columns: {
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
      "5": "grid-cols-5",
      "6": "grid-cols-6",
      "7": "grid-cols-7",
      "8": "grid-cols-8",
      "9": "grid-cols-9",
      "10": "grid-cols-10",
      "11": "grid-cols-11",
      "12": "grid-cols-12",
      none: "grid-cols-none",
    },
    rows: {
      "1": "grid-rows-1",
      "2": "grid-rows-2",
      "3": "grid-rows-3",
      "4": "grid-rows-4",
      "5": "grid-rows-5",
      "6": "grid-rows-6",
      none: "grid-rows-none",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-10",
    },
    flow: {
      row: "grid-flow-row",
      column: "grid-flow-col",
      dense: "grid-flow-dense",
      "row-dense": "grid-flow-row-dense",
      "column-dense": "grid-flow-col-dense",
    },
    inline: {
      false: "",
      true: "inline-grid",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
  },
  defaultVariants: {
    columns: "1",
    gap: "md",
    flow: "row",
    inline: false,
    align: "stretch",
    justify: "start",
  },
});

type GridProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof gridVariants> & {
    asChild?: boolean;
  };

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      className,
      columns,
      rows,
      gap,
      flow,
      inline,
      align,
      justify,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        data-slot="grid"
        className={cn(
          gridVariants({ columns, rows, gap, flow, inline, align, justify }),
          className,
        )}
        {...props}
      />
    );
  },
);
Grid.displayName = "Grid";

export { Grid, gridVariants };
export type { GridProps };
