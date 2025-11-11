import { Box } from "../box";
import { Text } from "../text";

type Props = {
  text: string;
};

export const BubbleText = ({ text }: Props) => {
  return (
    <Box className="bg-gray-100 p-3 rounded-md w-fit relative">
      <Box
        aria-hidden
        className="caret-transparent absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-xs bg-gray-100"
      />
      <Text color="subtle" size="md">
        {text}
      </Text>
    </Box>
  );
};
