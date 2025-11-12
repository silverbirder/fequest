import { HStack } from "../stack";
import { Text } from "../text";

type Props = {
  count?: number;
  emoji?: string;
};

export const EmojiReaction = ({ count, emoji }: Props) => {
  return (
    <HStack caret="transparent" spacing="xs">
      <Text size="md">{emoji}</Text>
      <Text size="md">{count}</Text>
    </HStack>
  );
};
