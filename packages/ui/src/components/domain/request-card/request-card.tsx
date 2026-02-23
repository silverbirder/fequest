import type { ComponentProps, ReactNode } from "react";

import { toIsoString } from "@repo/util";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { HStack, VStack } from "../../common/layout";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
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
  adminCommentNoticeSlot,
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
  const tRequestCard = useTranslations("UI.requestCard");
  const tDialog = useTranslations("UI.requestDialog");
  const createdAtText = toIsoString(detail.createdAt);
  const dialogContentId = `${idBase}-dialog-content`;
  const dialogDescriptionId = `${idBase}-dialog-description`;
  const titleText = detail.title?.trim() || text || tDialog("titleFallback");
  const triggerLabel = titleText
    ? tDialog("detailLabel", { title: titleText })
    : tDialog("detailLabelDefault");
  const emojiMenuId = `${idBase}-emoji-menu`;

  return (
    <Dialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
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
          <BubbleText
            adminCommentNoticeSlot={adminCommentNoticeSlot}
            status={status}
            text={text}
          >
            <DialogTrigger asChild>
              <Button
                aria-controls={dialogContentId}
                aria-label={triggerLabel}
                data-slot="dialog-trigger"
                size="icon"
                type="button"
                variant="link"
              >
                <ChevronRight />
              </Button>
            </DialogTrigger>
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
                label={tRequestCard("reactionAddLabel")}
                menuId={emojiMenuId}
                onSelect={onReact}
                triggerId={`${emojiMenuId}-trigger`}
              />
            ) : null}
          </HStack>
        </VStack>
      </HStack>
      <DialogContent
        aria-describedby={dialogDescriptionId}
        id={dialogContentId}
      >
        <VStack gap="lg">
          <DialogHeader>
            <HStack align="center" gap="md">
              <Avatar
                alt={avatar?.alt}
                fallbackText={avatar?.fallbackText}
                name={avatar?.name}
                src={avatar?.image}
              />
              <DialogTitle>
                <Text align="left" size="xl">
                  {titleText}
                </Text>
              </DialogTitle>
            </HStack>
            <DialogDescription asChild id={dialogDescriptionId}>
              <VStack w="full">{detail.content}</VStack>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Text color="subtle" size="sm">
              {tDialog("postedAt", { date: createdAtText ?? "" })}
            </Text>
          </DialogFooter>
        </VStack>
      </DialogContent>
    </Dialog>
  );
};
