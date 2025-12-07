"use client";

import type { Route } from "next";

import { RequestCard, VStack } from "@repo/ui/components";
import Form from "next/form";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ComponentProps, useMemo, useRef } from "react";

import type { ReactionSummary } from "../libs/reaction-summary";

type Props = {
  avatar?: RequestCardAvatar;
  canDelete?: boolean;
  defaultOpen?: boolean;
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
  defaultOpen,
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
          label: "削除",
          variant: "destructive" as const,
        }
      : undefined;

  const handleDialogOpenChange = (isOpen: boolean) => {
    if (!pathname) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    const currentOpen = searchParams.get("open");

    if (isOpen) {
      params.set("open", String(featureId));
    } else if (currentOpen === String(featureId)) {
      params.delete("open");
    } else {
      return;
    }

    const nextUrl = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(nextUrl as Route, { scroll: false });
  };

  return (
    <VStack gap="xs">
      <RequestCard
        avatar={avatar}
        defaultOpen={defaultOpen}
        detail={detail}
        enableEmojiPicker
        footerAction={footerAction}
        idBase={idBase}
        onOpenChange={handleDialogOpenChange}
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
