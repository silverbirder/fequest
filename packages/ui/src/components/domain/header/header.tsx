import type { Route } from "next";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { type UrlObject } from "url";

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

type LinkItem = {
  external?: boolean;
  href: Route | UrlObject;
  label: string;
};

type Props = {
  appName?: string;
  homeHref?: Route | UrlObject;
  links?: LinkItem[];
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
  links,
  loginAction,
  logoutAction,
  user,
}: Props) => {
  const t = useTranslations("UI.header");
  const isUserAuthenticated = Boolean(user);

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
        {isUserAuthenticated ? (
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
              {links?.map((link) => (
                <DropdownMenuItem key={link.label}>
                  <Button
                    asChild
                    justify="start"
                    size="sm"
                    variant="ghost"
                    w="full"
                  >
                    <Link
                      href={link.href}
                      rel={link.external ? "noreferrer" : undefined}
                      target={link.external ? "_blank" : undefined}
                    >
                      {link.label}
                    </Link>
                  </Button>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem>
                <Box asChild w="full">
                  <form action={logoutAction}>
                    <Button
                      justify="start"
                      size="sm"
                      type="submit"
                      variant="ghost"
                      w="full"
                    >
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
