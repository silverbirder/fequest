import { describe, expect, it } from "vitest";

import {
  type FeatureRequestReaction,
  summarizeReactions,
} from "./reaction-summary";

const createReaction = (
  overrides: Partial<FeatureRequestReaction>,
): FeatureRequestReaction => ({
  anonymousIdentifier: null,
  emoji: "👍",
  id: 1,
  userId: null,
  ...overrides,
});

describe("summarizeReactions", () => {
  it("returns an empty array when there are no reactions", () => {
    expect(
      summarizeReactions(undefined, {
        viewerAnonymousIdentifier: null,
        viewerUserId: null,
      }),
    ).toEqual([]);
  });

  it("aggregates counts and flags viewer reactions for signed-in users", () => {
    const reactions = [
      createReaction({ emoji: "👍", userId: "user-1" }),
      createReaction({ emoji: "👍", userId: "user-2" }),
      createReaction({ emoji: "🎉", userId: "user-1" }),
    ];

    const result = summarizeReactions(reactions, {
      viewerAnonymousIdentifier: null,
      viewerUserId: "user-1",
    });

    expect(result).toEqual([
      { count: 2, emoji: "👍", reactedByViewer: true },
      { count: 1, emoji: "🎉", reactedByViewer: true },
    ]);
  });

  it("marks anonymous viewer reactions when identifiers match", () => {
    const reactions = [
      createReaction({ anonymousIdentifier: "anon-1", emoji: "🔥" }),
      createReaction({ anonymousIdentifier: "anon-2", emoji: "🔥" }),
    ];

    const result = summarizeReactions(reactions, {
      viewerAnonymousIdentifier: "anon-1",
      viewerUserId: null,
    });

    expect(result).toEqual([{ count: 2, emoji: "🔥", reactedByViewer: true }]);
  });

  it("sorts reactions by ascending id before summarizing", () => {
    const reactions = [
      createReaction({ emoji: "😀", id: 3 }),
      createReaction({ emoji: "🎉", id: 1 }),
      createReaction({ emoji: "😀", id: 4 }),
      createReaction({ emoji: "👍", id: 2 }),
    ];

    const result = summarizeReactions(reactions, {
      viewerAnonymousIdentifier: null,
      viewerUserId: null,
    });

    expect(result).toEqual([
      { count: 1, emoji: "🎉", reactedByViewer: false },
      { count: 1, emoji: "👍", reactedByViewer: false },
      { count: 2, emoji: "😀", reactedByViewer: false },
    ]);
  });
});
