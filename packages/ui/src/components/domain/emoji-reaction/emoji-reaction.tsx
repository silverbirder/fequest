import { HStack } from "../../layout";
import { Button } from "../../shadcn";
import { Text } from "../../typography";

type Props = {
  active?: boolean;
  count?: number;
  emoji?: string;
  onClick?: () => void;
};

export const EmojiReaction = ({ active, count, emoji, onClick }: Props) => {
  return (
    <Button
      aria-pressed={active}
      onClick={onClick}
      size="sm"
      variant={active ? "default" : "outline"}
    >
      <HStack caret="transparent" gap="xs">
        <Text size="md">{emoji}</Text>
        <Text size="md">{count}</Text>
      </HStack>
    </Button>
  );
};
