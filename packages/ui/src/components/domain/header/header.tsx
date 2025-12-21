import type { Route } from "next";
import type { UrlObject } from "url";

import { useTranslations } from "next-intl";
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
  menuLinks?: { href: Route | UrlObject; label: string }[];
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
  menuLinks,
  user,
}: Props) => {
  const t = useTranslations("UI.header");
  const isAuthenticated = Boolean(user);

  return (
    <HStack
      align="center"
      asChild
      backdrop="sm"
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
              <Button
                aria-label={t("userMenuAriaLabel")}
                size="icon"
                variant="ghost"
              >
                <Avatar alt={user?.name} name={user?.name} src={user?.image} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              {menuLinks?.map((link) => (
                <DropdownMenuItem asChild key={link.label}>
                  <Box w="full">
                    <Button asChild size="sm" variant="ghost">
                      <Link href={link.href}>{link.label}</Link>
                    </Button>
                  </Box>
                </DropdownMenuItem>
              ))}
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
                <Box w="full">
                  <form action={logoutAction}>
                    <Button size="sm" type="submit" variant="ghost">
                      {t("logout")}
                    </Button>
                  </form>
                </Box>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <form action={loginAction}>
            <Button size="sm" type="submit" variant="outline">
              {t("login")}
            </Button>
          </form>
        )}
      </header>
    </HStack>
  );
};
