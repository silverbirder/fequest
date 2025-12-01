import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../common/shadcn";

type Props = {
  label?: string;
  menuId?: string;
  onSelect?: (emoji: string) => void;
  triggerId?: string;
};

export const EmojiPicker = ({
  label = "リアクションを追加",
  menuId,
  onSelect,
  triggerId,
}: Props) => {
  const handleSelect = (emoji: undefined | { native?: string }) => {
    const nativeEmoji = emoji?.native;
    if (!nativeEmoji) return;
    onSelect?.(nativeEmoji);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          aria-controls={menuId}
          aria-label={label}
          id={triggerId}
          size="sm"
          type="button"
          variant="outline"
        >
          ＋
        </Button>
      </PopoverTrigger>
      <PopoverContent id={menuId}>
        <Picker data={data} onEmojiSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};
