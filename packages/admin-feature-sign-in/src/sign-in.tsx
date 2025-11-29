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
    <Center bg="muted" px="md" py="xl" style={{ minHeight: "100vh" }} w="full">
      <Box
        bg="white"
        p="xl"
        radius="2xl"
        style={{
          border: "1px solid rgba(15, 23, 42, 0.06)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.08)",
          maxWidth: "420px",
        }}
        w="full"
      >
        <Stack gap="lg">
          <Stack align="center" gap="xs">
            <Text
              casing="uppercase"
              color="muted"
              size="xs"
              style={{ letterSpacing: "0.2em" }}
              weight="medium"
            >
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
              <Button
                data-slot="google-signin"
                size="lg"
                style={{ width: "100%" }}
                type="submit"
              >
                Googleで続行
              </Button>
            </form>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};
