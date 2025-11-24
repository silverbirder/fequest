import { type NextRequest, NextResponse } from "next/server";

import { auth } from "./server/auth";

const PUBLIC_PATHS = ["/sign-in"];

const protectedProxy = auth((req) => {
  const { auth: session, nextUrl } = req;
  const isPublic = PUBLIC_PATHS.includes(nextUrl.pathname);

  // If logged in and hitting the sign-in page, bounce home.
  if (session && isPublic) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // If not logged in and hitting a protected page, send to sign-in with return url.
  if (!session && !isPublic) {
    const signInUrl = new URL("/sign-in", nextUrl);
    signInUrl.searchParams.set("from", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export default function proxy(
  request: NextRequest,
  context: Parameters<typeof protectedProxy>[1],
) {
  return protectedProxy(request, context);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
