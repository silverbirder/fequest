"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  const [latestPost] = api.post.getLatest.useSuspenseQuery();

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
    },
  });

  return (
    <div>
      {latestPost ? (
        <p>Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createPost.mutate({ name });
        }}
      >
        <input
          onChange={(e) => setName(e.target.value)}
          placeholder="Title"
          type="text"
          value={name}
        />
        <button disabled={createPost.isPending} type="submit">
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
