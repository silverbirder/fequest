import {
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
} from "@repo/ui/components";

type Props = {
  appName?: string;
  onGoogleSignIn: () => Promise<void>;
};

export const SignIn = ({
  appName = "Fequest Admin",
  onGoogleSignIn,
}: Props) => {
  return (
    <Center minH="screen" px="md" py="xl" w="full">
      <Box
        bg="white"
        border="default"
        maxW="3xl"
        p="xl"
        radius="2xl"
        shadow="lg"
        w="full"
      >
        <VStack gap="lg">
          <VStack align="center" gap="xs">
            <Text casing="uppercase" color="muted" size="xs" weight="medium">
              {appName}
            </Text>
            <Heading align="center" level={2} size="2xl">
              サインイン
            </Heading>
            <Text align="center" color="muted" size="sm">
              管理画面を利用するには、Googleでログインしてください。
            </Text>
          </VStack>
          <Center w="full">
            <form action={onGoogleSignIn}>
              <Button data-slot="google-signin" size="lg" type="submit">
                Googleで続行
              </Button>
            </form>
          </Center>
        </VStack>
      </Box>
    </Center>
  );
};
