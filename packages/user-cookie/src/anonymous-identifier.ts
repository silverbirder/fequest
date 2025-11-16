import { CookieStoreLike, ONE_YEAR_IN_SECONDS } from "./cookie-store";

export const ANONYMOUS_IDENTIFIER_COOKIE_NAME = "fequestAnonId";

export type EnsureAnonymousIdentifierOptions = {
  generateId?: () => string;
  secure?: boolean;
};

export const ensureAnonymousIdentifier = (
  cookieStore: CookieStoreLike,
  { generateId, secure }: EnsureAnonymousIdentifierOptions = {},
) => {
  const existing = cookieStore.get(ANONYMOUS_IDENTIFIER_COOKIE_NAME)?.value;
  if (existing) {
    return existing;
  }

  const anonymousIdentifier = generateId?.() ?? crypto.randomUUID();
  cookieStore.set({
    httpOnly: true,
    maxAge: ONE_YEAR_IN_SECONDS,
    name: ANONYMOUS_IDENTIFIER_COOKIE_NAME,
    path: "/",
    sameSite: "lax",
    secure: secure ?? process.env.NODE_ENV === "production",
    value: anonymousIdentifier,
  });

  return anonymousIdentifier;
};

export const getAnonymousIdentifierFromHeaders = (headers: Headers) => {
  const cookieHeader = headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  for (const segment of cookieHeader.split(";")) {
    const [rawName, ...rest] = segment.split("=");
    if (rawName?.trim() !== ANONYMOUS_IDENTIFIER_COOKIE_NAME) {
      continue;
    }
    const value = rest.join("=");
    if (!value) {
      return null;
    }
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }

  return null;
};
