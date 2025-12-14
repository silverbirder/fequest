import type { ReactNode } from "react";

import { toIsoString } from "@repo/util";
import { ChevronRight } from "lucide-react";

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

type Detail = {
  content: ReactNode;
  createdAt?: Date | null | string;
  title?: string;
  updatedAt?: Date | null | string;
};

type Props = {
  avatar?: null | {
    alt?: null | string;
    fallbackText?: null | string;
    image?: null | string;
    name?: null | string;
  };
  defaultOpen?: boolean;
  detail: Detail;
  dialogTitle?: string;
  dialogTriggerLabel?: string;
  idBase?: string;
  onOpenChange?: (open: boolean) => void;
};

export const RequestDialog = ({
  avatar,
  defaultOpen,
  detail,
  dialogTitle,
  dialogTriggerLabel,
  idBase = "request-card",
  onOpenChange,
}: Props) => {
  const createdAtText = toIsoString(detail.createdAt);
  const dialogContentId = `${idBase}-dialog-content`;
  const dialogDescriptionId = `${idBase}-dialog-description`;
  const titleText = dialogTitle?.trim() || detail.title?.trim() || "詳細";
  const triggerLabel =
    dialogTriggerLabel?.trim() ||
    (titleText ? `${titleText}の詳細を表示` : "詳細を表示");

  return (
    <Dialog defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
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
              投稿日: {createdAtText}
            </Text>
          </DialogFooter>
        </VStack>
      </DialogContent>
    </Dialog>
  );
};
