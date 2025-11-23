import type { Route } from "next";
import type { UrlObject } from "url";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Container,
  HStack,
} from "@repo/ui/components";
import Link from "next/link";

type Props = {
  appName?: string;
  homeHref?: Route | UrlObject;
  loginAction: () => Promise<void>;
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
  user,
}: Props) => {
  const isAuthenticated = Boolean(user);

  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="py-4" padding="md">
        <HStack align="center" justify="between">
          <Link
            className="text-lg font-semibold tracking-tight text-foreground"
            href={homeHref}
          >
            {appName}
          </Link>

          {isAuthenticated ? (
            <Avatar>
              <AvatarImage
                alt={user?.name ?? "ログイン済みユーザー"}
                src={user?.image ?? undefined}
              />
              <AvatarFallback delayMs={0}>
                {createFallbackText(user?.name)}
              </AvatarFallback>
            </Avatar>
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
