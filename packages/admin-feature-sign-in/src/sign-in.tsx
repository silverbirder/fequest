import {
  AppLogo,
  Box,
  Button,
  Center,
  Heading,
  Text,
  VStack,
} from "@repo/ui/components";

type Props = {
  onGoogleSignIn: () => Promise<void>;
};

export const SignIn = ({ onGoogleSignIn }: Props) => {
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
                  管理画面
                </Text>
              </VStack>
            </VStack>
          </VStack>
          <VStack align="center" gap="sm">
            <Text color="subtle">
              管理画面を利用するには、Googleでログインしてください。
            </Text>
            <form action={onGoogleSignIn}>
              <Button data-slot="google-signin" size="lg" type="submit">
                Googleでログイン
              </Button>
            </form>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
};
