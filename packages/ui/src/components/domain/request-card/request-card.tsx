import type { ComponentProps, ReactNode } from "react";

import { Box, HStack, VStack } from "../../layout";
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
} from "../../shadcn";
import { Text } from "../../typography";
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
    content: string;
    createdAt?: Date | null | string;
    title?: string;
    updatedAt?: Date | null | string;
  };
  enableEmojiPicker?: boolean;
  footerActions?: ReactNode;
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

  return (
    <HStack align="baseline" gap="sm">
      <Avatar>
        <AvatarImage alt={avatar.alt} src={avatar.src}></AvatarImage>
        <AvatarFallback>{avatar.fallbackText}</AvatarFallback>
      </Avatar>
      <VStack gap="xs">
        <Dialog>
          <DialogTrigger asChild>
            <button
              aria-label={dialogTriggerLabel}
              className="rounded-none border-none bg-transparent p-0 text-left"
              type="button"
            >
              <BubbleText text={text} />
            </button>
          </DialogTrigger>
          <DialogContent>
            <VStack gap="lg">
              <DialogHeader className="gap-4">
                <HStack align="center" gap="md">
                  <Avatar className="size-12">
                    <AvatarImage alt={avatar.alt} src={avatar.src} />
                    <AvatarFallback className="text-lg">
                      {avatar.fallbackText}
                    </AvatarFallback>
                  </Avatar>
                  <DialogTitle className="text-left text-xl">
                    {dialogTitle}
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
              <Box className="w-full rounded-md border bg-muted/20 p-4">
                <Text asChild size="md">
                  <p className="whitespace-pre-wrap break-words">
                    {detail.content}
                  </p>
                </Text>
              </Box>
              <DialogFooter className="w-full">
                <div className="flex w-full items-center justify-between gap-2">
                  {footerActions ? (
                    <div className="flex gap-2">{footerActions}</div>
                  ) : (
                    <div className="flex-1" />
                  )}
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      閉じる
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </VStack>
          </DialogContent>
        </Dialog>
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
            <EmojiPicker label="リアクションを追加" onSelect={onReact} />
          ) : null}
        </HStack>
      </VStack>
    </HStack>
  );
};
