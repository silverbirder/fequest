import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

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

export const EmojiPicker = ({ label, menuId, onSelect, triggerId }: Props) => {
  const t = useTranslations("UI.emojiPicker");
  const resolvedLabel = label ?? t("label");
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
          aria-label={resolvedLabel}
          id={triggerId}
          size="sm"
          type="button"
          variant="outline"
        >
          <Plus />
        </Button>
      </PopoverTrigger>
      <PopoverContent id={menuId}>
        <Picker data={data} onEmojiSelect={handleSelect} />
      </PopoverContent>
    </Popover>
  );
};
