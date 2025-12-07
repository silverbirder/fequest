import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
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
              <HStack gap="sm" justify="center">
                <Text aria-hidden display="inline" size="2xl" weight="bold">
                  🗳️
                </Text>
                <Heading align="center" level={1} size="4xl" weight="extrabold">
                  Fequest Admin
                </Heading>
              </HStack>
              <Text align="center" color="muted" size="lg">
                ほしいとつくるを共有するプラットフォーム Fequest の管理画面
              </Text>
            </VStack>
          </VStack>
          <VStack align="start" gap="sm">
            <Text color="subtle">
              管理画面を利用するには、Googleでログインしてください。
            </Text>
            <form action={onGoogleSignIn}>
              <Button data-slot="google-signin" size="lg" type="submit">
                Googleでログイン
              </Button>
            </form>
            <Text color="muted" size="xs">
              ※
              いつでも退会できます。退会すると、あなたのデータはすべて削除されますのでご安心ください。
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Center>
  );
};
