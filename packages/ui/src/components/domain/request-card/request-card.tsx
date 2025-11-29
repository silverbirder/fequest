import type { ComponentProps, ReactNode } from "react";

import { Expand } from "lucide-react";

import { Box, HStack, VStack } from "../../common/layout";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../common/shadcn";
import { Text } from "../../common/typography";
import { BubbleText } from "../bubble-text";
import { EmojiPicker } from "../emoji-picker";
import { EmojiReaction } from "../emoji-reaction";

type Props = ComponentProps<typeof BubbleText> & {
  avatar: {
    alt?: string;
    fallbackText?: string;
    src?: string;
  };
  detail: {
    content: ReactNode;
    createdAt?: Date | null | string;
    title?: string;
    updatedAt?: Date | null | string;
  };
  enableEmojiPicker?: boolean;
  footerActions?: ReactNode;
  idBase?: string;
  onReact?: (emoji: string) => void;
  reactions?: {
    count: number;
    emoji: string;
    reactedByViewer?: boolean;
  }[];
};

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDateTime = (value?: Date | null | string) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return dateTimeFormatter.format(date);
};

export const RequestCard = ({
  avatar,
  detail,
  enableEmojiPicker = false,
  footerActions,
  idBase = "request-card",
  onReact,
  reactions,
  text,
}: Props) => {
  const dialogTitle = detail.title?.trim() || text;
  const createdAtText = formatDateTime(detail.createdAt);
  const updatedAtText = formatDateTime(detail.updatedAt);
  const dialogTriggerLabel = dialogTitle
    ? `${dialogTitle}の詳細を表示`
    : "詳細を表示";
  const mdxContent = detail.content;
  const dialogContentId = `${idBase}-dialog-content`;
  const emojiMenuId = `${idBase}-emoji-menu`;

  return (
    <HStack align="start" gap="sm">
      <VStack gap="sm" justify="between" self="stretch">
        <Avatar>
          <AvatarImage alt={avatar.alt} src={avatar.src}></AvatarImage>
          <AvatarFallback>{avatar.fallbackText}</AvatarFallback>
        </Avatar>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              aria-controls={dialogContentId}
              aria-label={dialogTriggerLabel}
              size="icon"
              type="button"
              variant="outline"
            >
              <Expand />
            </Button>
          </DialogTrigger>
          <DialogContent id={dialogContentId}>
            <VStack gap="lg">
              <DialogHeader>
                <HStack align="center" gap="md">
                  <Avatar>
                    <AvatarImage alt={avatar.alt} src={avatar.src} />
                    <AvatarFallback>
                      <Text asChild size="xl">
                        <span>{avatar.fallbackText}</span>
                      </Text>
                    </AvatarFallback>
                  </Avatar>
                  <DialogTitle>
                    <Text align="left" size="xl">
                      {dialogTitle}
                    </Text>
                  </DialogTitle>
                </HStack>
              </DialogHeader>
              <VStack gap="xs">
                <Text color="subtle" size="sm">
                  作成日: {createdAtText}
                </Text>
                <Text color="subtle" size="sm">
                  更新日: {updatedAtText}
                </Text>
              </VStack>
              <Box bg="muted" p="md" radius="md" w="full">
                {mdxContent}
              </Box>
              <DialogFooter>
                <HStack align="center" gap="sm" justify="between" w="full">
                  {footerActions ? (
                    <HStack gap="sm">{footerActions}</HStack>
                  ) : (
                    <Box w="full" />
                  )}
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      閉じる
                    </Button>
                  </DialogClose>
                </HStack>
              </DialogFooter>
            </VStack>
          </DialogContent>
        </Dialog>
      </VStack>
      <VStack gap="sm">
        <BubbleText text={text} />
        <HStack gap="xs">
          {reactions?.map((reaction, index) => (
            <EmojiReaction
              active={reaction.reactedByViewer}
              count={reaction.count}
              emoji={reaction.emoji}
              key={index}
              onClick={onReact ? () => onReact(reaction.emoji) : undefined}
            />
          ))}
          {enableEmojiPicker && onReact ? (
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
