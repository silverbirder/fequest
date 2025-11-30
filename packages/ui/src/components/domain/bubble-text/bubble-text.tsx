import { PropsWithChildren } from "react";

import { Box, HStack } from "../../common/layout";
import { Text } from "../../common/typography";

type Props = PropsWithChildren<{
  text: string;
}>;

export const BubbleText = ({ children, text }: Props) => {
  return (
    <Box bg="muted" p="md" position="relative" radius="md">
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
      <HStack gap="sm" justify="between" self="stretch" wrap="wrap">
        <Text color="subtle" size="md">
          {text}
        </Text>
        {children}
      </HStack>
    </Box>
  );
};
