import type { ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import { Box, HStack, VStack } from "../../common/layout";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
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
  avatar: {
    alt?: string;
    fallbackText?: string;
    src?: string;
  };
  detail: Detail;
  dialogTitle?: string;
  dialogTriggerLabel?: string;
  footerActions?: ReactNode;
  idBase?: string;
};

const dateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
});

const formatDateTime = (value?: Date | null | string) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return dateTimeFormatter.format(date);
};

export const RequestDialog = ({
  avatar,
  detail,
  dialogTitle,
  dialogTriggerLabel,
  footerActions,
  idBase = "request-card",
}: Props) => {
  const createdAtText = formatDateTime(detail.createdAt);
  const updatedAtText = formatDateTime(detail.updatedAt);
  const dialogContentId = `${idBase}-dialog-content`;
  const titleText = dialogTitle?.trim() || detail.title?.trim() || "詳細";
  const triggerLabel =
    dialogTriggerLabel?.trim() ||
    (titleText ? `${titleText}の詳細を表示` : "詳細を表示");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-controls={dialogContentId}
          aria-label={triggerLabel}
          size="icon"
          type="button"
          variant="link"
        >
          <ChevronRight />
        </Button>
      </DialogTrigger>
      <DialogContent id={dialogContentId}>
        <VStack gap="lg">
          <DialogHeader>
            <HStack align="center" gap="md">
              <Avatar>
                <AvatarImage alt={avatar.alt} src={avatar.src} />
                <AvatarFallback>
                  <Text asChild size="xl">
                    <span>{avatar.fallbackText}</span>
                  </Text>
                </AvatarFallback>
              </Avatar>
              <DialogTitle>
                <Text align="left" size="xl">
                  {titleText}
                </Text>
              </DialogTitle>
            </HStack>
          </DialogHeader>
          <VStack gap="xs">
            <Text color="subtle" size="sm">
              作成日: {createdAtText}
            </Text>
            <Text color="subtle" size="sm">
              更新日: {updatedAtText}
            </Text>
          </VStack>
          <Box bg="muted" p="md" radius="md" w="full">
            {detail.content}
          </Box>
          <DialogFooter>
            <HStack align="center" gap="sm" justify="between" w="full">
              {footerActions ? (
                <HStack gap="sm">{footerActions}</HStack>
              ) : (
                <Box w="full" />
              )}
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  閉じる
                </Button>
              </DialogClose>
            </HStack>
          </DialogFooter>
        </VStack>
      </DialogContent>
    </Dialog>
  );
};
