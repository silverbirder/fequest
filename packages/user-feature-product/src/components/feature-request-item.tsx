"use client";

import { RequestCard, VStack } from "@repo/ui/components";
import Form from "next/form";
import { type ComponentProps, useMemo, useRef } from "react";

import type { ReactionSummary } from "../libs/reaction-summary";

type Props = {
  avatar: RequestCardAvatar;
  canDelete?: boolean;
  detail: RequestCardDetail;
  featureId: number;
  onDeleteFeatureRequest?: (formData: FormData) => Promise<void>;
  onReactToFeature: (formData: FormData) => Promise<void>;
  reactions: ReactionSummary[];
  text: string;
};

type RequestCardAvatar = ComponentProps<typeof RequestCard>["avatar"];
type RequestCardDetail = ComponentProps<typeof RequestCard>["detail"];

export const FeatureRequestItem = ({
  avatar,
  canDelete,
  detail,
  featureId,
  onDeleteFeatureRequest,
  onReactToFeature,
  reactions,
  text,
}: Props) => {
  const idBase = `feature-${featureId}`;
  const formRef = useRef<HTMLFormElement>(null);
  const emojiInputRef = useRef<HTMLInputElement>(null);
  const actionInputRef = useRef<HTMLInputElement>(null);

  const handleReact = (emoji: string) => {
    const clickedReaction = reactionMap.get(emoji);
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

  const reactionMap = useMemo(
    () => new Map(reactions.map((reaction) => [reaction.emoji, reaction])),
    [reactions],
  );
  const reactionOptions = reactions;

  const footerAction =
    canDelete && onDeleteFeatureRequest
      ? {
          action: onDeleteFeatureRequest,
          fields: { featureId },
          label: "リクエストを削除",
          variant: "destructive" as const,
        }
      : undefined;

  return (
    <VStack gap="xs">
      <RequestCard
        avatar={avatar}
        detail={detail}
        enableEmojiPicker
        footerAction={footerAction}
        idBase={idBase}
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
          defaultValue={reactionOptions[0]?.emoji ?? ""}
          name="emoji"
          ref={emojiInputRef}
          type="hidden"
        />
      </Form>
    </VStack>
  );
};
