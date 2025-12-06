import type React from "react";

import { Slot } from "@radix-ui/react-slot";

type AsChildProp = {
  asChild?: boolean;
};

const resolveSlotComponent = <TDefault extends React.ElementType>(
  asChild: AsChildProp["asChild"],
  defaultComponent: TDefault,
): React.ElementType => (asChild ? Slot : defaultComponent);

export { resolveSlotComponent };
export type { AsChildProp };
