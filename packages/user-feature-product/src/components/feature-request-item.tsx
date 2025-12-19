"use client";

import type { Route } from "next";
import type { UrlObject } from "url";

import { Button, HStack, RequestCard, VStack } from "@repo/ui/components";
import { Pencil } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ComponentProps, useRef } from "react";

import type { ReactionSummary } from "../libs";

type Props = {
  avatar?: RequestCardAvatar;
  defaultOpen?: boolean;
  detail: RequestCardDetail;
  editHref?: UrlObject;
  featureId: number;
  onReactToFeature: (formData: FormData) => Promise<void>;
  reactions: ReactionSummary[];
  status?: "closed" | "open";
  text: string;
};

type RequestCardAvatar = ComponentProps<typeof RequestCard>["avatar"];
type RequestCardDetail = ComponentProps<typeof RequestCard>["detail"];

export const FeatureRequestItem = ({
  avatar,
  defaultOpen,
  detail,
  editHref,
  featureId,
  onReactToFeature,
  reactions,
  status,
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

  const reactionMap = new Map(
    reactions.map((reaction) => [reaction.emoji, reaction]),
  );
  const reactionOptions = reactions;

  const detailContent = (
    <VStack gap="xs">
      {detail.content}
      {editHref && (
        <HStack justify="end" w="full">
          <Button
            aria-label="編集ページを開く"
            asChild
            size="sm"
            variant="ghost"
          >
            <Link href={editHref} prefetch={false}>
              <Pencil />
              編集する
            </Link>
          </Button>
        </HStack>
      )}
    </VStack>
  );

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
        detail={{
          ...detail,
          content: detailContent,
        }}
        enableEmojiPicker
        idBase={idBase}
        onOpenChange={handleDialogOpenChange}
        onReact={handleReact}
        reactions={reactionOptions}
        status={status}
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
