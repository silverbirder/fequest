import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

const authResult = NextAuth(authConfig);
const { auth: uncachedAuth, handlers } = authResult;

const auth = cache(uncachedAuth);
const signIn: typeof authResult.signIn = authResult.signIn;
const signOut: typeof authResult.signOut = authResult.signOut;

export { auth, handlers, signIn, signOut };
