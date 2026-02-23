"use client";

import type { FeatureRequestAdminComment } from "@repo/type";
import type { Route } from "next";
import type { UrlObject } from "url";

import {
  Avatar,
  Box,
  Button,
  DialogTrigger,
  HStack,
  RequestCard,
  Text,
  Textarea,
  VStack,
} from "@repo/ui/components";
import { toIsoString } from "@repo/util";
import { MessageCircle, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import Form from "next/form";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ComponentProps, useRef } from "react";

import type { ReactionSummary } from "../libs";

type Props = {
  adminCommentDetail?: FeatureRequestAdminComment | null;
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
  adminCommentDetail,
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
  const t = useTranslations("UserFeatureProduct");

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
  const adminCommentContent = adminCommentDetail?.content?.trim() ?? "";
  const hasAdminComment = adminCommentContent.length > 0;
  const adminName =
    adminCommentDetail?.adminUser?.name?.trim() ||
    t("adminCommentAuthorFallback");
  const adminUpdatedAt = toIsoString(adminCommentDetail?.updatedAt);
  const adminCommentNoticeSlot = hasAdminComment ? (
    <DialogTrigger asChild>
      <Button
        aria-label={t("adminCommentNotice")}
        border="none"
        data-slot="admin-comment-notice-trigger"
        shadow="none"
        size="sm"
        type="button"
        variant="outline"
      >
        <HStack align="center" bg="background" gap="xs" p="xs" radius="sm">
          <Text color="accent" size="sm">
            <MessageCircle size={14} />
          </Text>
          <Text color="accent" size="sm">
            {t("adminCommentNotice")}
          </Text>
        </HStack>
      </Button>
    </DialogTrigger>
  ) : undefined;

  const detailContent = (
    <VStack gap="xs">
      {detail.content}
      {editHref && (
        <HStack justify="end" w="full">
          <Button
            aria-label={t("editLinkAriaLabel")}
            asChild
            size="sm"
            variant="ghost"
          >
            <Link href={editHref} prefetch={false}>
              <Pencil />
              {t("editLinkText")}
            </Link>
          </Button>
        </HStack>
      )}
      {hasAdminComment ? (
        <VStack align="start" gap="xs" w="full">
          <HStack align="start" gap="sm" w="full">
            <Avatar
              fallbackText={adminName}
              name={adminName}
              src={adminCommentDetail?.adminUser?.image ?? undefined}
            />
            <VStack align="start" gap="xs" w="full">
              <Box bg="muted" p="md" radius="sm" w="full">
                <Textarea
                  aria-label={t("adminCommentAriaLabel")}
                  readOnly
                  value={adminCommentContent}
                  variant="display"
                />
              </Box>
              {adminUpdatedAt ? (
                <Text color="subtle" size="sm">
                  {t("adminCommentUpdatedAt", { date: adminUpdatedAt })}
                </Text>
              ) : null}
            </VStack>
          </HStack>
        </VStack>
      ) : null}
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
    <VStack data-feature-status={status ?? "open"} gap="xs">
      <RequestCard
        adminCommentNoticeSlot={adminCommentNoticeSlot}
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
