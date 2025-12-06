import type { Route } from "next";
import type { UrlObject } from "url";

import {
  Avatar,
  Box,
  Button,
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
      <HStack align="center" justify="between" p="md">
        <Link href={homeHref}>
          <Text size="lg" weight="semibold">
            {appName}
          </Text>
        </Link>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="ユーザーメニュー" size="icon" variant="ghost">
                <Avatar alt={user?.name} name={user?.name} src={user?.image} />
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
    </header>
  );
};
