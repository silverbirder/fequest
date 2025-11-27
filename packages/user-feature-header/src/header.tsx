import type { Route } from "next";
import type { UrlObject } from "url";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Box,
  Button,
  Container,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HStack,
  Text,
} from "@repo/ui/components";
import Link from "next/link";

type Props = {
  appName?: string;
  homeHref?: Route | UrlObject;
  loginAction: () => Promise<void>;
  logoutAction: () => Promise<void>;
  user?: null | User;
};

type User = {
  image?: null | string;
  name?: null | string;
};

const createFallbackText = (name?: null | string) => {
  const trimmed = (name ?? "").trim();
  if (trimmed.length === 0) return "U";

  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    return (words[0]?.[0] ?? "").concat(words[1]?.[0] ?? "").toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
};

export const Header = ({
  appName = "Fequest",
  homeHref = "/",
  loginAction,
  logoutAction,
  user,
}: Props) => {
  const isAuthenticated = Boolean(user);

  return (
    <header>
      <Container padding="md">
        <HStack align="center" justify="between">
          <Link href={homeHref}>
            <Text size="lg" weight="semibold">
              {appName}
            </Text>
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="ユーザーメニュー"
                  size="icon"
                  variant="ghost"
                >
                  <Avatar>
                    <AvatarImage
                      alt={user?.name ?? "ログイン済みユーザー"}
                      src={user?.image ?? undefined}
                    />
                    <AvatarFallback delayMs={0}>
                      {createFallbackText(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuItem asChild>
                  <form action={logoutAction}>
                    <Box w="full">
                      <Button size="sm" type="submit" variant="ghost">
                        ログアウト
                      </Button>
                    </Box>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <form action={loginAction}>
              <Button size="sm" type="submit" variant="outline">
                ログイン
              </Button>
            </form>
          )}
        </HStack>
      </Container>
    </header>
  );
};
