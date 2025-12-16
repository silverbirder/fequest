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
    default: {
      bottom: "-3" as const,
      right: "-8" as const,
      size: "xl" as const,
    },
    spacious: {
      bottom: "-2" as const,
      right: "-6" as const,
      size: "xs" as const,
    },
  };

  const badge = badgePresets[badgeVariant] ?? badgePresets.default;

  return (
    <Box data-slot={dataSlot} position="relative">
      <LabelComponent data-slot={`${dataSlot}-label`}>{content}</LabelComponent>
      <Box
        bottom={badge.bottom}
        data-slot={`${dataSlot}-emoji`}
        display="flex"
        gap="xs"
        position="absolute"
        right={badge.right}
      >
        {[0, 1, 2].map((index) => (
          <Text
            data-slot={`${dataSlot}-emoji-item`}
            display="inline-block"
            key={index}
            size={badge.size}
          >
            {emoji}
          </Text>
        ))}
      </Box>
    </Box>
  );
};

AppLogo.displayName = "AppLogo";
