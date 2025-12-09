import type { ComponentProps } from "react";

import { Box, HStack } from "../../common/layout";
import { Avatar } from "../../common/shadcn";
import { BubbleInput } from "../bubble-input";

type Props = ComponentProps<typeof BubbleInput> & {
  avatar?: {
    alt?: null | string;
    fallbackText?: null | string;
    image?: null | string;
    name?: null | string;
  };
};

export const RequestInput = ({ avatar, ...inputProps }: Props) => {
  const avatarProps = {
    alt: avatar?.alt ?? undefined,
    fallbackText: avatar?.fallbackText ?? "YU",
    name: avatar?.name ?? undefined,
    src: avatar?.image ?? undefined,
  };

  return (
    <HStack align="start" gap="sm" w="full">
      <Avatar
        alt={avatarProps.alt}
        fallbackText={avatarProps.fallbackText}
        name={avatarProps.name}
        src={avatarProps.src}
      />
      <Box flex="1" w="full">
        <BubbleInput {...inputProps} />
      </Box>
    </HStack>
  );
};
