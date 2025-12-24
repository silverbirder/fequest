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
  Grid,
  Heading,
  HStack,
  Input,
  SubmitButton,
  Text,
  VStack,
} from "@repo/ui/components";
import { wrapActionWithToast } from "@repo/ui/lib/wrap-action-with-toast";
import { useTranslations } from "next-intl";
import Form from "next/form";
import { type CSSProperties, useState } from "react";

type Props = {
  avatarUrl?: null | string;
  hueBase: number;
  onResetHueBase: (formData: FormData) => Promise<void> | void;
  onUpdateAvatar: (formData: FormData) => Promise<void> | void;
  onUpdateHueBase: (formData: FormData) => Promise<void> | void;
  onWithdraw: (formData: FormData) => Promise<void> | void;
};

export const Setting = ({
  avatarUrl,
  hueBase,
  onResetHueBase,
  onUpdateAvatar,
  onUpdateHueBase,
  onWithdraw,
}: Props) => {
  const t = useTranslations("UserSetting");
  const [avatarInput, setAvatarInput] = useState(avatarUrl ?? "");
  const [hueBaseInput, setHueBaseInput] = useState(String(hueBase));
  const huePresets = Array.from({ length: 19 }, (_, index) => index * 20);
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
  const updateHueBaseAction = wrapActionWithToast(onUpdateHueBase, {
    error: t("theme.toast.error"),
    loading: t("theme.toast.loading"),
    success: t("theme.toast.success"),
  });
  const resetHueBaseAction = wrapActionWithToast(onResetHueBase, {
    error: t("theme.resetToast.error"),
    loading: t("theme.resetToast.loading"),
    success: t("theme.resetToast.success"),
  });

  return (
    <VStack gap="xl" w="full">
      <VStack align="start" gap="sm" w="full">
        <Heading level={1} size="lg">
          {t("title")}
        </Heading>
        <Text color="muted" size="sm">
          {t("description")}
        </Text>
      </VStack>
      <Box bg="white" p="lg" radius="md" w="full">
        <VStack align="start" gap="md" w="full">
          <VStack align="start" gap="sm" w="full">
            <Heading level={2} size="lg">
              {t("avatar.title")}
            </Heading>
            <Text color="muted" size="sm">
              {t("avatar.description")}
            </Text>
          </VStack>
          <Box asChild w="full">
            <Form action={updateAvatarAction}>
              <VStack align="end" gap="md" w="full">
                <HStack w="full">
                  <Avatar
                    alt={t("avatar.title")}
                    src={avatarInput.trim() || undefined}
                  />
                  <VStack gap="xs" w="full">
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
                  </VStack>
                </HStack>
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
          <VStack align="start" gap="sm" w="full">
            <Heading level={2} size="lg">
              {t("theme.title")}
            </Heading>
            <Text color="muted" size="sm">
              {t("theme.description")}
            </Text>
          </VStack>
          <Box asChild w="full">
            <Form action={updateHueBaseAction}>
              <VStack align="end" gap="md" w="full">
                <VStack gap="xs" w="full">
                  <VStack align="start" gap="xs" w="full">
                    <Grid columns="7" gap="xs" w="full">
                      {huePresets.map((preset) => (
                        <Button
                          key={preset}
                          onClick={() => setHueBaseInput(String(preset))}
                          size="sm"
                          type="button"
                          variant="secondary"
                        >
                          <HStack gap="xs">
                            <Box
                              aria-hidden
                              h="3"
                              radius="full"
                              shrink="0"
                              // eslint-disable-next-line react/forbid-component-props
                              style={
                                {
                                  backgroundColor: `oklch(var(--tone-40) var(--chroma-90) ${preset}deg)`,
                                } as CSSProperties
                              }
                              w="3"
                            />
                            <Text size="xs">{preset}</Text>
                          </HStack>
                        </Button>
                      ))}
                    </Grid>
                  </VStack>
                  <Input
                    id="hue-base"
                    inputMode="numeric"
                    max={360}
                    min={0}
                    name="hueBase"
                    onChange={(event) => setHueBaseInput(event.target.value)}
                    placeholder={t("theme.placeholder")}
                    step={1}
                    type="number"
                    value={hueBaseInput}
                  />
                </VStack>
                <HStack gap="sm" justify="end" w="full">
                  <Button
                    formAction={resetHueBaseAction}
                    size="sm"
                    type="submit"
                    variant="outline"
                  >
                    {t("theme.resetAction")}
                  </Button>
                  <SubmitButton
                    pendingLabel={t("theme.toast.loading")}
                    size="sm"
                  >
                    {t("theme.action")}
                  </SubmitButton>
                </HStack>
              </VStack>
            </Form>
          </Box>
        </VStack>
      </Box>
      <Box bg="white" p="lg" radius="md" w="full">
        <VStack align="start" gap="md" w="full">
          <VStack align="start" gap="sm" w="full">
            <Heading level={2} size="lg">
              {t("withdraw.title")}
            </Heading>
            <Text color="muted" size="sm">
              {t("withdraw.description")}
            </Text>
          </VStack>
          <VStack align="start" gap="xs" w="full">
            <Text color="subtle" size="sm">
              {t("withdraw.items.featureRequests")}
            </Text>
            <Text color="subtle" size="sm">
              {t("withdraw.items.reactions")}
            </Text>
          </VStack>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button self="end" size="sm" type="button" variant="destructive">
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
