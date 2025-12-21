"use client";

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
  SubmitButton,
  Text,
  VStack,
} from "@repo/ui/components";
import { wrapActionWithToast } from "@repo/ui/lib/wrap-action-with-toast";
import { useTranslations } from "next-intl";
import Form from "next/form";

type Props = {
  onWithdraw: (formData: FormData) => Promise<void> | void;
};

export const Setting = ({ onWithdraw }: Props) => {
  const t = useTranslations("AdminSetting");
  const submitAction = wrapActionWithToast(onWithdraw, {
    error: t("toast.error"),
    loading: t("toast.loading"),
    success: t("toast.success"),
  });

  return (
    <VStack align="start" gap="lg" w="full">
      <Heading size="lg">{t("title")}</Heading>
      <Box bg="white" p="lg" radius="md" w="full">
        <VStack align="start" gap="md" w="full">
          <Text color="muted">{t("description")}</Text>
          <VStack align="start" gap="xs" w="full">
            <Text color="subtle" size="sm">
              {t("items.products")}
            </Text>
            <Text color="subtle" size="sm">
              {t("items.featureRequests")}
            </Text>
            <Text color="subtle" size="sm">
              {t("items.reactions")}
            </Text>
          </VStack>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" type="button" variant="destructive">
                {t("action")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("dialog.title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("dialog.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Form action={submitAction}>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("dialog.cancel")}</AlertDialogCancel>
                  <SubmitButton
                    pendingLabel={t("toast.loading")}
                    size="sm"
                    variant="destructive"
                  >
                    {t("action")}
                  </SubmitButton>
                </AlertDialogFooter>
              </Form>
            </AlertDialogContent>
          </AlertDialog>
        </VStack>
      </Box>
    </VStack>
  );
};
