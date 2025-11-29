import { Box } from "../../common/layout";
import { Text } from "../../common/typography";

type Props = {
  text: string;
};

export const BubbleText = ({ text }: Props) => {
  return (
    <Box bg="muted" p="md" position="relative" radius="md" w="fit">
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
      <Text color="subtle" size="md">
        {text}
      </Text>
    </Box>
  );
};
