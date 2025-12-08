import { PropsWithChildren } from "react";

import { Box, HStack } from "../../common/layout";
import { Text } from "../../common/typography";

type Props = PropsWithChildren<{
  status?: "closed" | "open";
  text: string;
}>;

export const BubbleText = ({ children, status = "open", text }: Props) => {
  const isClosed = status === "closed";

  return (
    <Box
      bg={isClosed ? "border" : "muted"}
      p="md"
      position="relative"
      radius="md"
    >
      {isClosed && (
        <HStack
          justify="center"
          left="1/2"
          position="absolute"
          rotate="15"
          top="1/2"
          translateX="-1/2"
          translateY="-1/2"
          zIndex="10"
        >
          <Box
            aria-label="完了したリクエスト"
            bg="muted"
            px="sm"
            py="xs"
            radius="md"
            shadow="sm"
          >
            <Text color="subtle" size="sm" weight="semibold">
              完了
            </Text>
          </Box>
        </HStack>
      )}
      <Box
        aria-hidden
        bg={isClosed ? "border" : "muted"}
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
      <HStack justify="between" self="stretch">
        <Text color="subtle" size="md">
          {text}
        </Text>
        <Box shrink="0">{children}</Box>
      </HStack>
    </Box>
  );
};
