import { type AsChildProp, resolveSlotComponent } from "@repo/ui/lib/as-child";
import {
  splitStyleProps,
  type StyleProps,
  stylePropsClassNames,
} from "@repo/ui/lib/style-props";
import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const gridVariants = cva("grid", {
  defaultVariants: {
    align: "stretch",
    columns: "1",
    flow: "row",
    gap: "md",
    inline: false,
    justify: "start",
  },
  variants: {
    align: {
      center: "items-center",
      end: "items-end",
      start: "items-start",
      stretch: "items-stretch",
    },
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
    flow: {
      column: "grid-flow-col",
      "column-dense": "grid-flow-col-dense",
      dense: "grid-flow-dense",
      row: "grid-flow-row",
      "row-dense": "grid-flow-row-dense",
    },
    gap: {
      "2xl": "gap-10",
      lg: "gap-6",
      md: "gap-4",
      none: "gap-0",
      sm: "gap-2",
      xl: "gap-8",
      xs: "gap-1",
    },
    inline: {
      false: "",
      true: "inline-grid",
    },
    justify: {
      around: "justify-around",
      between: "justify-between",
      center: "justify-center",
      end: "justify-end",
      evenly: "justify-evenly",
      start: "justify-start",
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
  },
});

type GridProps = AsChildProp &
  Omit<React.ComponentPropsWithoutRef<"div">, keyof StyleProps> &
  StyleProps &
  VariantProps<typeof gridVariants>;

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    {
      align,
      asChild = false,
      className,
      columns,
      flow,
      gap,
      inline,
      justify,
      rows,
      ...props
    },
    ref,
  ) => {
    const Comp = resolveSlotComponent(asChild, "div");
    const { restProps, styleProps } = splitStyleProps(props);

    return (
      <Comp
        className={cn(
          gridVariants({ align, columns, flow, gap, inline, justify, rows }),
          stylePropsClassNames(styleProps),
          className,
        )}
        data-slot="grid"
        ref={ref}
        {...restProps}
      />
    );
  },
);
Grid.displayName = "Grid";

export { Grid, gridVariants };
export type { GridProps };
