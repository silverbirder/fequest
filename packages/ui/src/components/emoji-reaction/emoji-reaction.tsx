import { HStack } from "../layout";
import { Button } from "../shadcn";
import { Text } from "../typography";

type Props = {
  count?: number;
  emoji?: string;
  onClick?: () => void;
};

export const EmojiReaction = ({ count, emoji, onClick }: Props) => {
  return (
    <Button onClick={onClick} size="sm" variant="outline">
      <HStack caret="transparent" gap="xs">
        <Text size="md">{emoji}</Text>
        <Text size="md">{count}</Text>
      </HStack>
    </Button>
  );
};
