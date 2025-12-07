import { Box, Button, Center, Heading, Stack, Text } from "@repo/ui/components";

type Props = {
  appName?: string;
  onGoogleSignIn: () => Promise<void>;
};

export const SignIn = ({
  appName = "Fequest Admin",
  onGoogleSignIn,
}: Props) => {
  return (
    <Center bg="muted" minH="screen" px="md" py="xl" w="full">
      <Box
        bg="white"
        border="default"
        maxW="3xl"
        p="xl"
        radius="2xl"
        shadow="lg"
        w="full"
      >
        <Stack gap="lg">
          <Stack align="center" gap="xs">
            <Text casing="uppercase" color="muted" size="xs" weight="medium">
              {appName}
            </Text>
            <Heading align="center" level={2} size="2xl">
              サインイン
            </Heading>
            <Text align="center" color="muted" size="sm">
              管理画面を利用するには、Googleでログインしてください。
            </Text>
          </Stack>

          <Stack gap="md">
            <form action={onGoogleSignIn}>
              <Button data-slot="google-signin" size="lg" type="submit">
                Googleで続行
              </Button>
            </form>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};
