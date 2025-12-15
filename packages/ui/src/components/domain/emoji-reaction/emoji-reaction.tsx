import { HStack } from "../../common/layout";
import { Button } from "../../common/shadcn";
import { Text } from "../../common/typography";

type Props = {
  active?: boolean;
  count?: number;
  emoji?: string;
  interactive?: boolean;
  onClick?: () => void;
};

export const EmojiReaction = ({
  active,
  count,
  emoji,
  interactive = true,
  onClick,
}: Props) => {
  return (
    <Button
      aria-pressed={active}
      disabled={!interactive}
      onClick={interactive ? onClick : undefined}
      size="sm"
      variant={active ? "secondary" : "outline"}
    >
      <HStack caret="transparent" gap="xs">
        <Text size="md">{emoji}</Text>
        <Text size="md">{count}</Text>
      </HStack>
    </Button>
  );
};
