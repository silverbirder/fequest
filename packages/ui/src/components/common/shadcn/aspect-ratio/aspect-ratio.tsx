"use client";

import type React from "react";

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import { cn } from "@repo/ui/lib/utils";

type Props = React.ComponentPropsWithoutRef<
  typeof AspectRatioPrimitive.Root
> & {
  className?: string;
};

export const AspectRatio = ({ className, ...props }: Props) => (
  <AspectRatioPrimitive.Root
    className={cn("relative", className)}
    data-slot="aspect-ratio"
    {...props}
  />
);

AspectRatio.displayName = "AspectRatio";

export type { Props as AspectRatioProps };
