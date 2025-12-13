"use client";

import type { ComponentProps } from "react";

import { useFormStatus } from "react-dom";

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

export const RequestInput = ({
  avatar,
  disabled: disabledProp,
  helperText: helperTextProp,
  ...inputProps
}: Props) => {
  const avatarProps = {
    alt: avatar?.alt ?? undefined,
    fallbackText: avatar?.fallbackText ?? "YU",
    name: avatar?.name ?? undefined,
    src: avatar?.image ?? undefined,
  };
  const { pending: formPending } = useFormStatus();
  const isDisabled = disabledProp ?? formPending;
  const helperText = formPending
    ? (helperTextProp ?? "送信中...")
    : helperTextProp;

  return (
    <HStack align="start" gap="sm" w="full">
      <Avatar
        alt={avatarProps.alt}
        fallbackText={avatarProps.fallbackText}
        name={avatarProps.name}
        src={avatarProps.src}
      />
      <Box flex="1" w="full">
        <BubbleInput
          disabled={isDisabled}
          helperText={helperText}
          {...inputProps}
        />
      </Box>
    </HStack>
  );
};
