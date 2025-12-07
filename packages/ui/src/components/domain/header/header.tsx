import type { Route } from "next";
import type { UrlObject } from "url";

import Link from "next/link";

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
} from "../../common";
import { AppLogo } from "../app-logo";

type Props = {
  appendLink?: { href: string; label: string };
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
  appendLink,
  appName = "Fequest",
  homeHref = "/",
  loginAction,
  logoutAction,
  user,
}: Props) => {
  const isAuthenticated = Boolean(user);

  return (
    <HStack
      align="center"
      asChild
      backdrop="lg"
      borderBottom="default"
      justify="between"
      p="md"
      position="sticky"
      shadow="sm"
      top="0"
      w="full"
      zIndex="10"
    >
      <header>
        <Link href={homeHref}>
          <AppLogo asChild badgeVariant="spacious">
            <Text size="lg" weight="bold">
              {appName}
            </Text>
          </AppLogo>
        </Link>
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="ユーザーメニュー" size="icon" variant="ghost">
                <Avatar alt={user?.name} name={user?.name} src={user?.image} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              {appendLink && (
                <DropdownMenuItem asChild>
                  <Box w="full">
                    <Button asChild size="sm" variant="ghost">
                      <a
                        href={appendLink.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {appendLink.label}
                      </a>
                    </Button>
                  </Box>
                </DropdownMenuItem>
              )}
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
      </header>
    </HStack>
  );
};
