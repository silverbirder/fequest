import { Box } from "../box";
import { Text } from "../text";

type Props = {
  text: string;
};

export const BubbleText = ({ text }: Props) => {
  return (
    <Box bg="gray-100" p="md" position="relative" radius="md" w="fit">
      <Box
        aria-hidden
        bg="gray-100"
        caret="transparent"
        h="3"
        left="-1"
        position="absolute"
        radius="xs"
        rotate="45"
        top="1/2"
        translateY="-1/2"
        w="3"
      />
      <Text color="subtle" size="md">
        {text}
      </Text>
    </Box>
  );
};
