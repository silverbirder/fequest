import { CookieStoreLike, ONE_YEAR_IN_SECONDS } from "./cookie-store";

export const HUE_BASE_COOKIE_NAME = "admin-hue-base";
export const DEFAULT_HUE_BASE = 238;

export type HueBaseCookieOptions = {
  maxAge?: number;
  path?: string;
  sameSite?: "lax" | "none" | "strict";
};

export const parseHueBase = (value?: null | string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return null;
  }

  if (parsed < 0 || parsed > 360) {
    return null;
  }

  return parsed;
};

export const toHueBaseCss = (value: number) => `${value}deg`;

export const getHueBaseFromCookieStore = (cookieStore: CookieStoreLike) => {
  const raw = cookieStore.get(HUE_BASE_COOKIE_NAME)?.value;
  return parseHueBase(raw) ?? DEFAULT_HUE_BASE;
};

export const setHueBaseCookie = (
  cookieStore: CookieStoreLike,
  value: number,
  options: HueBaseCookieOptions = {},
) => {
  cookieStore.set({
    maxAge: options.maxAge ?? ONE_YEAR_IN_SECONDS,
    name: HUE_BASE_COOKIE_NAME,
    path: options.path ?? "/",
    sameSite: options.sameSite ?? "lax",
    value: String(value),
  });
};

export const clearHueBaseCookie = (
  cookieStore: CookieStoreLike,
  options: HueBaseCookieOptions = {},
) => {
  cookieStore.set({
    maxAge: 0,
    name: HUE_BASE_COOKIE_NAME,
    path: options.path ?? "/",
    sameSite: options.sameSite ?? "lax",
    value: "",
  });
};
