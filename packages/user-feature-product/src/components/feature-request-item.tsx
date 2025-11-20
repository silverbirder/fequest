"use client";

import { RequestCard, VStack } from "@repo/ui/components";
import Form from "next/form";
import { type ComponentProps, useRef } from "react";

import type { ReactionSummary } from "../libs/reaction-summary";

const AVAILABLE_EMOJIS = ["👍", "🎉", "❤️", "🔥", "💡"] as const;

type Props = {
  avatar: RequestCardAvatar;
  detail: RequestCardDetail;
  featureId: number;
  onReactToFeature: (formData: FormData) => Promise<void>;
  reactions: ReactionSummary[];
  text: string;
};

type RequestCardAvatar = ComponentProps<typeof RequestCard>["avatar"];
type RequestCardDetail = ComponentProps<typeof RequestCard>["detail"];

export const FeatureRequestItem = ({
  avatar,
  detail,
  featureId,
  onReactToFeature,
  reactions,
  text,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const emojiInputRef = useRef<HTMLInputElement>(null);
  const actionInputRef = useRef<HTMLInputElement>(null);

  const handleReact = (emoji: string) => {
    const clickedReaction = reactionOptions.find(
      (reaction) => reaction.emoji === emoji,
    );
    const nextAction = clickedReaction?.reactedByViewer ? "down" : "up";
    if (actionInputRef.current) {
      actionInputRef.current.value = nextAction;
    }
    if (emojiInputRef.current) {
      emojiInputRef.current.value = emoji;
    }
    if (formRef.current?.requestSubmit) {
      formRef.current.requestSubmit();
    } else {
      formRef.current?.submit();
    }
  };

  const reactionMap = new Map(
    reactions.map((reaction) => [reaction.emoji, reaction]),
  );
  const reactionOptions = AVAILABLE_EMOJIS.map(
    (emoji) =>
      reactionMap.get(emoji) ?? { count: 0, emoji, reactedByViewer: false },
  );

  return (
    <VStack gap="xs">
      <RequestCard
        avatar={avatar}
        detail={detail}
        onReact={handleReact}
        reactions={reactionOptions}
        text={text}
      />
      <Form action={onReactToFeature} ref={formRef}>
        <input name="featureId" type="hidden" value={featureId} />
        <input
          defaultValue="up"
          name="action"
          ref={actionInputRef}
          type="hidden"
        />
        <input
          defaultValue={reactionOptions[0]?.emoji ?? AVAILABLE_EMOJIS[0]}
          name="emoji"
          ref={emojiInputRef}
          type="hidden"
        />
      </Form>
    </VStack>
  );
};
