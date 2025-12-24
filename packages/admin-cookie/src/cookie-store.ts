export type CookieSetOptions = {
  httpOnly?: boolean;
  maxAge?: number;
  name: string;
  path?: string;
  sameSite?: "lax" | "none" | "strict";
  secure?: boolean;
  value: string;
};

export type CookieStoreLike = {
  get: (name: string) => undefined | { value?: string };
  set: (options: CookieSetOptions) => void;
};

export const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365;
