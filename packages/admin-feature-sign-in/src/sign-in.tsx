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
              <AppLogo asChild>
                <Heading level={1}>Fequest Admin</Heading>
              </AppLogo>
              <Text align="center" color="muted" size="lg">
                ほしいとつくるを共有するプラットフォーム Fequest の管理画面
              </Text>
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
