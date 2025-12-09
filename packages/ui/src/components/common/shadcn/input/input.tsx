import { cn } from "@repo/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const inputVariants = cva("", {
  defaultVariants: {
    appearance: "default",
  },
  variants: {
    appearance: {
      bubble:
        "bg-transparent border-0 shadow-none outline-none px-0 py-0 h-auto min-h-0 w-full min-w-0 focus-visible:ring-0 focus-visible:border-none focus-visible:shadow-none",
      default:
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    },
  },
});

type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>;

function Input({ appearance, className, type, ...props }: InputProps) {
  const classes = cn(inputVariants({ appearance }), className);

  return (
    <input
      className={classes}
      data-appearance={appearance}
      data-slot="input"
      type={type}
      {...props}
    />
  );
}

export { Input };
