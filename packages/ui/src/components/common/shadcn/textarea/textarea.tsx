import { cn } from "@repo/ui/lib/utils";
import * as React from "react";

type TextareaProps = React.ComponentProps<"textarea"> & {
  variant?: "default" | "display";
};

function Textarea({ className, variant = "default", ...props }: TextareaProps) {
  const baseClass =
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm";

  const displayClass =
    "resize-none border-transparent bg-transparent shadow-none focus-visible:ring-0 focus-visible:border-transparent focus-visible:outline-none w-full h-full min-h-0 px-0 py-0";

  return (
    <textarea
      className={cn(
        baseClass,
        variant === "display" && displayClass,
        className,
      )}
      data-slot="textarea"
      {...props}
    />
  );
}

export { Textarea };
