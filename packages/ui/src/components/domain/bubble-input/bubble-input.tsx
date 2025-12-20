import type { ComponentPropsWithoutRef } from "react";

import { useTranslations } from "next-intl";

import { Box, VStack } from "../../common/layout";
import { Input } from "../../common/shadcn";
import { Text } from "../../common/typography";

type BubbleInputProps = ComponentPropsWithoutRef<typeof Input> & {
  helperText?: string;
};

export const BubbleInput = ({
  helperText,
  placeholder,
  type = "text",
  ...rest
}: BubbleInputProps) => {
  const t = useTranslations("UI.bubbleInput");
  const resolvedHelperText = helperText ?? t("helperText");
  const resolvedPlaceholder = placeholder ?? t("placeholder");

  return (
    <VStack align="stretch" gap="xs" group>
      <Box position="relative" w="full">
        <Box
          aria-hidden
          bg="muted"
          caret="transparent"
          h="3"
          left="-1"
          position="absolute"
          radius="xs"
          rotate="45"
          top="4"
          translateY="-1/2"
          w="3"
        />
        <Box bg="muted" p="md" radius="md" w="full">
          <Input
            appearance="bubble"
            placeholder={resolvedPlaceholder}
            type={type}
            {...rest}
          />
        </Box>
        <Text color="muted" size="xs">
          {t("note")}
        </Text>
      </Box>
      <Text
        color="muted"
        display="block"
        focusWithinOpacity="100"
        focusWithinTransition="opacity"
        focusWithinTransitionDuration="200"
        opacity="0"
        size="md"
        transition="opacity"
        transitionDuration="200"
      >
        {resolvedHelperText}
      </Text>
    </VStack>
  );
};
