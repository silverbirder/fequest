"use client";

import { RequestCard, VStack } from "@repo/ui/components";
import Form from "next/form";
import { useRef } from "react";

export type ReactionSummary = {
  count: number;
  emoji: string;
};

type Props = {
  avatarFallbackText: string;
  featureId: number;
  onReactToFeature: (formData: FormData) => Promise<void>;
  reactions: ReactionSummary[];
  text: string;
};

export const FeatureRequestItem = ({
  avatarFallbackText,
  featureId,
  onReactToFeature,
  reactions,
  text,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);
  const emojiInputRef = useRef<HTMLInputElement>(null);

  const handleReact = (emoji: string) => {
    if (emojiInputRef.current) {
      emojiInputRef.current.value = emoji;
    }
    if (formRef.current?.requestSubmit) {
      formRef.current.requestSubmit();
    } else {
      formRef.current?.submit();
    }
  };

  const reactionOptions =
    reactions.length > 0 ? reactions : [{ count: 0, emoji: "👍" }];

  return (
    <VStack gap="xs">
      <RequestCard
        avatar={{ fallbackText: avatarFallbackText }}
        onReact={handleReact}
        reactions={reactionOptions}
        text={text}
      />
      <Form action={onReactToFeature} ref={formRef}>
        <input name="featureId" type="hidden" value={featureId} />
        <input name="action" type="hidden" value="up" />
        <input
          defaultValue={reactionOptions[0]?.emoji ?? "👍"}
          name="emoji"
          ref={emojiInputRef}
          type="hidden"
        />
      </Form>
    </VStack>
  );
};
