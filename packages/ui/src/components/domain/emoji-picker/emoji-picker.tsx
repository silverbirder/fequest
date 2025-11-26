import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../shadcn";

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-0 p-0" id={menuId}>
        <Picker
          data={data}
          navPosition="none"
          onEmojiSelect={handleSelect}
          previewPosition="none"
          searchPosition="none"
          skinTonePosition="search"
          theme="auto"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
