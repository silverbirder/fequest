"use client";

import {
  AppLogo,
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
} from "@repo/ui/components";
import { useTranslations } from "next-intl";

type Props = {
  onGoogleSignIn: () => Promise<void>;
};

export const SignIn = ({ onGoogleSignIn }: Props) => {
  const t = useTranslations("AdminSignIn");

  return (
    <Center minH="screen">
      <Box maxW="3xl" p="xl" w="full">
        <VStack align="center" gap="2xl">
          <VStack align="center" gap="md">
            <VStack align="center" gap="sm">
              <VStack align="center" justify="center">
                <AppLogo asChild>
                  <Heading display="inline-block" level={1}>
                    Fequest
                  </Heading>
                </AppLogo>
                <Text display="inline-block" size="2xl" weight="bold">
                  {t("title")}
                </Text>
              </VStack>
            </VStack>
          </VStack>
          <VStack align="center" gap="sm">
            <Text color="subtle">{t("description")}</Text>
            <form action={onGoogleSignIn}>
              <Button data-slot="google-signin" size="lg" type="submit">
                {t("googleButton")}
              </Button>
            </form>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
};
