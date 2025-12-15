import type { ComponentProps, ReactNode } from "react";

import { HStack, VStack } from "../../common/layout";
import { Avatar } from "../../common/shadcn";
import { BubbleText } from "../bubble-text";
import { EmojiPicker } from "../emoji-picker";
import { EmojiReaction } from "../emoji-reaction";
import { RequestDialog } from "../request-dialog";

type Props = ComponentProps<typeof BubbleText> & {
  avatar?: null | {
    alt?: null | string;
    fallbackText?: null | string;
    image?: null | string;
    name?: null | string;
  };
  defaultOpen?: boolean;
  detail: {
    content: ReactNode;
    createdAt?: Date | null | string;
    title?: string;
    updatedAt?: Date | null | string;
  };
  enableEmojiPicker?: boolean;
  idBase?: string;
  onOpenChange?: (open: boolean) => void;
  onReact?: (emoji: string) => void;
  reactions?: {
    count: number;
    emoji: string;
    reactedByViewer?: boolean;
  }[];
  reactionsInteractive?: boolean;
};

export const RequestCard = ({
  avatar,
  defaultOpen,
  detail,
  enableEmojiPicker = false,
  idBase = "request-card",
  onOpenChange,
  onReact,
  reactions,
  reactionsInteractive = true,
  status,
  text,
}: Props) => {
  const dialogTitle = detail.title?.trim() || text;
  const dialogTriggerLabel = dialogTitle
    ? `${dialogTitle}の詳細を表示`
    : "詳細を表示";
  const emojiMenuId = `${idBase}-emoji-menu`;

  return (
    <HStack align="start" gap="sm">
      <VStack gap="sm" justify="between" self="stretch">
        <Avatar
          alt={avatar?.alt}
          fallbackText={avatar?.fallbackText}
          name={avatar?.name}
          src={avatar?.image}
        />
      </VStack>
      <VStack gap="sm">
        <BubbleText status={status} text={text}>
          <RequestDialog
            avatar={avatar}
            defaultOpen={defaultOpen}
            detail={detail}
            dialogTitle={dialogTitle}
            dialogTriggerLabel={dialogTriggerLabel}
            idBase={idBase}
            onOpenChange={onOpenChange}
          />
        </BubbleText>
        <HStack gap="xs" wrap="wrap">
          {reactions?.map((reaction, index) => (
            <EmojiReaction
              active={reaction.reactedByViewer}
              count={reaction.count}
              emoji={reaction.emoji}
              interactive={reactionsInteractive && Boolean(onReact)}
              key={index}
              onClick={
                reactionsInteractive && onReact
                  ? () => onReact(reaction.emoji)
                  : undefined
              }
            />
          ))}
          {enableEmojiPicker && reactionsInteractive && onReact ? (
            <EmojiPicker
              label="リアクションを追加"
              menuId={emojiMenuId}
              onSelect={onReact}
              triggerId={`${emojiMenuId}-trigger`}
            />
          ) : null}
        </HStack>
      </VStack>
    </HStack>
  );
};
