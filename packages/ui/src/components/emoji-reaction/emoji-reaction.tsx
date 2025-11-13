import { Button } from "../button";
import { HStack } from "../stack";
import { Text } from "../text";

type Props = {
  count?: number;
  emoji?: string;
};

export const EmojiReaction = ({ count, emoji }: Props) => {
  return (
    <Button size="sm" variant="outline">
      <HStack caret="transparent" gap="xs">
        <Text size="md">{emoji}</Text>
        <Text size="md">{count}</Text>
      </HStack>
    </Button>
  );
};
