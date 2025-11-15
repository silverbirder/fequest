import type { ComponentProps } from "react";

import { HStack, VStack } from "../../layout";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn";
import { BubbleText } from "../bubble-text";
import { EmojiReaction } from "../emoji-reaction";

type Props = ComponentProps<typeof BubbleText> & {
  avatar: {
    alt?: string;
    fallbackText?: string;
    src?: string;
  };
  onReact?: (emoji: string) => void;
  reactions?: {
    count: number;
    emoji: string;
  }[];
};

export const RequestCard = ({ avatar, onReact, reactions, text }: Props) => (
  <HStack align="baseline" gap="sm">
    <Avatar>
      <AvatarImage alt={avatar.alt} src={avatar.src}></AvatarImage>
      <AvatarFallback>{avatar.fallbackText}</AvatarFallback>
    </Avatar>
    <VStack gap="xs">
      <BubbleText text={text} />
      <HStack gap="xs">
        {reactions?.map((reaction, index) => (
          <EmojiReaction
            count={reaction.count}
            emoji={reaction.emoji}
            key={index}
            onClick={onReact ? () => onReact(reaction.emoji) : undefined}
          />
        ))}
      </HStack>
    </VStack>
  </HStack>
);
