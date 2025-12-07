import type { ComponentProps, ReactNode } from "react";

import { ChevronRight } from "lucide-react";
import Form from "next/form";

import { HStack, VStack } from "../../common/layout";
import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../common/shadcn";
import { Text } from "../../common/typography";

export type FooterAction = {
  action: (formData: FormData) => Promise<void> | void;
  fields?: Record<string, boolean | number | string>;
  label: string;
  type?: ComponentProps<typeof Button>["type"];
  variant?: ComponentProps<typeof Button>["variant"];
};

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
    name?: null | string;
    src?: null | string;
  };
  defaultOpen?: boolean;
  detail: Detail;
  dialogTitle?: string;
  dialogTriggerLabel?: string;
  footerAction?: FooterAction;
  idBase?: string;
  onOpenChange?: (open: boolean) => void;
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
  defaultOpen,
  detail,
  dialogTitle,
  dialogTriggerLabel,
  footerAction,
  idBase = "request-card",
  onOpenChange,
}: Props) => {
  const createdAtText = formatDateTime(detail.createdAt);
  const dialogContentId = `${idBase}-dialog-content`;
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
              <Avatar
                alt={avatar?.alt}
                fallbackText={avatar?.fallbackText}
                name={avatar?.name}
                src={avatar?.src}
              />
              <DialogTitle>
                <Text align="left" size="xl">
                  {titleText}
                </Text>
              </DialogTitle>
            </HStack>
          </DialogHeader>
          <VStack w="full">
            {detail.content}
            {footerAction && (
              <HStack self="end">
                <Form action={footerAction.action}>
                  {Object.entries(footerAction.fields ?? {}).map(
                    ([name, value]) => (
                      <input
                        key={name}
                        name={name}
                        type="hidden"
                        value={String(value)}
                      />
                    ),
                  )}
                  <Button
                    type={footerAction.type ?? "submit"}
                    variant={footerAction.variant ?? "destructive"}
                  >
                    {footerAction.label}
                  </Button>
                </Form>
              </HStack>
            )}
          </VStack>
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
