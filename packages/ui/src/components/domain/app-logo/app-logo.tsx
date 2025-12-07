import type React from "react";

import { type AsChildProp, resolveSlotComponent } from "@repo/ui/lib/as-child";

import { Box, Text } from "../../common";

type Props = AsChildProp & {
  badgeVariant?: "default" | "spacious";
  children?: React.ReactNode;
  dataSlot?: string;
  emoji?: string;
  label?: string;
};

export const AppLogo = ({
  asChild = false,
  badgeVariant = "default",
  children,
  dataSlot = "app-logo",
  emoji = "🗳️",
  label = "Fequest",
}: Props) => {
  const LabelComponent = resolveSlotComponent(asChild, "div");
  const content = children ?? label;

  const badgePresets = {
    default: { right: "-6" as const, size: "2xl" as const, top: "-2" as const },
    spacious: { right: "-4" as const, size: "sm" as const, top: "-2" as const },
  };

  const badge = badgePresets[badgeVariant] ?? badgePresets.default;

  return (
    <Box data-slot={dataSlot} position="relative">
      <LabelComponent data-slot={`${dataSlot}-label`}>{content}</LabelComponent>
      <Text
        display="inline-block"
        position="absolute"
        right={badge.right}
        size={badge.size}
        top={badge.top}
      >
        {emoji}
      </Text>
    </Box>
  );
};

AppLogo.displayName = "AppLogo";
