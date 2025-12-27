/* eslint-env node */
/* global process */
import { createEnv } from "@t3-oss/env-nextjs";
import { fallback, optional, picklist, pipe, string, url } from "valibot";

export const env = createEnv({
  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: string(),
  },

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    ADMIN_DOMAIN_URL: process.env.ADMIN_DOMAIN_URL,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    GA_ID: process.env.GA_ID,
    NODE_ENV: process.env.NODE_ENV,
  },
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    ADMIN_DOMAIN_URL: pipe(string(), url()),
    AUTH_GOOGLE_ID: string(),
    AUTH_GOOGLE_SECRET: string(),
    AUTH_SECRET:
      process.env.NODE_ENV === "production" ? string() : optional(string()),
    DATABASE_URL: pipe(string(), url()),
    GA_ID: optional(string()),
    NODE_ENV: fallback(
      picklist(["development", "test", "production"]),
      "development"
    ),
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
