"use client";

import type { UrlObject } from "url";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  SubmitButton,
  Text,
  Textarea,
  VStack,
} from "@repo/ui/components";
import { wrapActionWithToast } from "@repo/ui/lib/wrap-action-with-toast";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Form from "next/form";
import Link from "next/link";
import { useId } from "react";

type Props = {
  backHref: UrlObject;
  defaultValues: {
    content: string;
    title: string;
  };
  featureId: number;
  onDelete?: (formData: FormData) => Promise<void> | void;
  onSubmit: (formData: FormData) => Promise<void> | void;
  productName: string;
  requestTitle?: string;
};

export const RequestEdit = ({
  backHref,
  defaultValues,
  featureId,
  onDelete,
  onSubmit,
  productName,
  requestTitle,
}: Props) => {
  const submitFormId = useId();
  const t = useTranslations("UserFeatureRequestEdit");

  const submitAction = wrapActionWithToast(onSubmit, {
    error: t("toast.save.error"),
    loading: t("toast.save.loading"),
    success: t("toast.save.success"),
  });

  const deleteAction =
    onDelete &&
    wrapActionWithToast(onDelete, {
      error: t("toast.delete.error"),
      loading: t("toast.delete.loading"),
      success: t("toast.delete.success"),
    });

  return (
    <VStack gap="xl" w="full">
      <VStack align="start" gap="md" w="full">
        <Heading size="lg">{t("title")}</Heading>
        <Text color="muted">
          {t("description", {
            productName,
            requestTitle: requestTitle ?? defaultValues.title,
          })}
        </Text>
      </VStack>
      <Box asChild bg="white" p="lg" radius="md" w="full">
        <VStack align="start" bg="white" gap="lg" w="full">
          <VStack align="start" gap="lg" w="full">
            <Box asChild w="full">
              <VStack align="start" gap="xs" w="full">
                <Text asChild color="subtle" size="sm">
                  <label htmlFor="title">{t("labels.title")}</label>
                </Text>
                <Input
                  defaultValue={defaultValues.title}
                  form={submitFormId}
                  id="title"
                  maxLength={255}
                  name="title"
                  required
                />
              </VStack>
            </Box>
            <Box asChild w="full">
              <VStack align="start" gap="xs" w="full">
                <Text asChild color="subtle" size="sm">
                  <label htmlFor="content">{t("labels.content")}</label>
                </Text>
                <Textarea
                  defaultValue={defaultValues.content}
                  form={submitFormId}
                  id="content"
                  name="content"
                  placeholder={t("placeholders.content")}
                  rows={6}
                />
              </VStack>
            </Box>
            <HStack borderTop="default" justify="end" pt="lg" w="full">
              <HStack gap="md">
                {deleteAction ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        {t("buttons.delete")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {t("deleteDialog.title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {t("deleteDialog.description")}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <Form action={deleteAction}>
                        <input
                          name="featureId"
                          type="hidden"
                          value={String(featureId)}
                        />
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("buttons.cancel")}
                          </AlertDialogCancel>
                          <SubmitButton
                            formAction={deleteAction}
                            pendingLabel={t("toast.delete.loading")}
                            variant="destructive"
                          >
                            {t("buttons.confirmDelete")}
                          </SubmitButton>
                        </AlertDialogFooter>
                      </Form>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
                <Form action={submitAction} id={submitFormId}>
                  <input
                    name="featureId"
                    type="hidden"
                    value={String(featureId)}
                  />
                  <SubmitButton
                    formAction={submitAction}
                    pendingLabel={t("toast.save.loading")}
                  >
                    {t("buttons.save")}
                  </SubmitButton>
                </Form>
              </HStack>
            </HStack>
          </VStack>
        </VStack>
      </Box>
      <HStack justify="end" w="full">
        <Button asChild variant="link">
          <Link href={backHref} prefetch={false}>
            <ArrowLeft />
            {t("buttons.back")}
          </Link>
        </Button>
      </HStack>
    </VStack>
  );
};
