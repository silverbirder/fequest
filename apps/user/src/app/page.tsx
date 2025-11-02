import Link from "next/link";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Button } from "@repo/ui/components";

export default async function Home() {
  const session = await auth();
  return (
    <HydrateClient>
      <Button variant="destructive">Open alert</Button>
      <div>
        <p>{session && <span>Logged in as {session.user?.name}</span>}</p>
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          {session ? "Sign out" : "Sign in"}
        </Link>
      </div>
    </HydrateClient>
  );
}
