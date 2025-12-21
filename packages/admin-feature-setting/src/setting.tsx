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
  Avatar,
  Box,
  Button,
  Heading,
  Input,
  SubmitButton,
  Text,
  VStack,
} from "@repo/ui/components";
import { wrapActionWithToast } from "@repo/ui/lib/wrap-action-with-toast";
import { useTranslations } from "next-intl";
import Form from "next/form";
import { useState } from "react";

type Props = {
  avatarUrl?: null | string;
  onUpdateAvatar: (formData: FormData) => Promise<void> | void;
  onWithdraw: (formData: FormData) => Promise<void> | void;
};

export const Setting = ({ avatarUrl, onUpdateAvatar, onWithdraw }: Props) => {
  const t = useTranslations("AdminSetting");
  const [avatarInput, setAvatarInput] = useState(avatarUrl ?? "");
  const submitAction = wrapActionWithToast(onWithdraw, {
    error: t("withdraw.toast.error"),
    loading: t("withdraw.toast.loading"),
    success: t("withdraw.toast.success"),
  });
  const updateAvatarAction = wrapActionWithToast(onUpdateAvatar, {
    error: t("avatar.toast.error"),
    loading: t("avatar.toast.loading"),
    success: t("avatar.toast.success"),
  });

  return (
    <VStack align="start" gap="lg" w="full">
      <Heading size="lg">{t("title")}</Heading>
      <Box bg="white" p="lg" radius="md" w="full">
        <VStack align="start" gap="md" w="full">
          <Heading level={3} size="lg">
            {t("avatar.title")}
          </Heading>
          <Text color="muted">{t("avatar.description")}</Text>
          <Avatar
            alt={t("avatar.title")}
            src={avatarInput.trim() || undefined}
          />
          <Box asChild w="full">
            <Form action={updateAvatarAction}>
              <VStack align="start" gap="sm" w="full">
                <Text asChild color="subtle" size="sm">
                  <label htmlFor="avatar-url">{t("avatar.label")}</label>
                </Text>
                <Input
                  id="avatar-url"
                  name="avatarUrl"
                  onChange={(event) => setAvatarInput(event.target.value)}
                  placeholder={t("avatar.placeholder")}
                  type="url"
                  value={avatarInput}
                />
                <SubmitButton
                  pendingLabel={t("avatar.toast.loading")}
                  size="sm"
                >
                  {t("avatar.action")}
                </SubmitButton>
              </VStack>
            </Form>
          </Box>
        </VStack>
      </Box>
      <Box bg="white" p="lg" radius="md" w="full">
        <VStack align="start" gap="md" w="full">
          <Heading level={3} size="lg">
            {t("withdraw.title")}
          </Heading>
          <Text color="muted">{t("withdraw.description")}</Text>
          <VStack align="start" gap="xs" w="full">
            <Text color="subtle" size="sm">
              {t("withdraw.items.products")}
            </Text>
            <Text color="subtle" size="sm">
              {t("withdraw.items.featureRequests")}
            </Text>
            <Text color="subtle" size="sm">
              {t("withdraw.items.reactions")}
            </Text>
          </VStack>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" type="button" variant="destructive">
                {t("withdraw.action")}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t("withdraw.dialog.title")}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t("withdraw.dialog.description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Form action={submitAction}>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("withdraw.dialog.cancel")}
                  </AlertDialogCancel>
                  <SubmitButton
                    pendingLabel={t("withdraw.toast.loading")}
                    size="sm"
                    variant="destructive"
                  >
                    {t("withdraw.action")}
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
