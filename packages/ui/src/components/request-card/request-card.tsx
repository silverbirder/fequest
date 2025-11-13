import type { ComponentProps } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { BubbleText } from "../bubble-text";
import { HStack } from "../stack";

type Props = ComponentProps<typeof BubbleText> & {
  avatar: {
    alt?: string;
    fallbackText?: string;
    src?: string;
  };
};

export const RequestCard = ({ avatar, text }: Props) => (
  <HStack align="center" gap="sm">
    <Avatar>
      <AvatarImage alt={avatar.alt} src={avatar.src}></AvatarImage>
      <AvatarFallback>{avatar.fallbackText}</AvatarFallback>
    </Avatar>
    <BubbleText text={text} />
  </HStack>
);
