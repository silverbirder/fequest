import type { ComponentPropsWithoutRef } from "react";

import { Box, VStack } from "../../common/layout";
import { Input } from "../../common/shadcn";
import { Text } from "../../common/typography";

type BubbleInputProps = ComponentPropsWithoutRef<typeof Input> & {
  helperText?: string;
};

export const BubbleInput = ({
  helperText = "Enterで送信",
  placeholder = "新しいリクエストを入力...",
  type = "text",
  ...rest
}: BubbleInputProps) => {
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
            placeholder={placeholder}
            type={type}
            {...rest}
          />
        </Box>
        <Text color="muted" size="xs">
          ※ 投稿後も内容を編集・削除できます。
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
        {helperText}
      </Text>
    </VStack>
  );
};
