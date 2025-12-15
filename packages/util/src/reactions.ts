import type { FeatureRequestReaction, ReactionSummary } from "@repo/type";

type ViewerIdentity = {
  viewerAnonymousIdentifier?: null | string;
  viewerUserId?: null | string;
};

export const isReactionFromViewer = (
  reaction: FeatureRequestReaction,
  { viewerAnonymousIdentifier, viewerUserId }: ViewerIdentity,
) => {
  if (viewerUserId) {
    return reaction.userId === viewerUserId;
  }

  if (viewerAnonymousIdentifier) {
    return (
      !reaction.userId &&
      reaction.anonymousIdentifier === viewerAnonymousIdentifier
    );
  }

  return false;
};

export const summarizeReactions = (
  reactions: FeatureRequestReaction[] | null | undefined,
  identity: ViewerIdentity,
): ReactionSummary[] => {
  if (!reactions || reactions.length === 0) {
    return [];
  }

  const sortedReactions = [...reactions].sort((left, right) => {
    if (left.id == null && right.id == null) {
      return 0;
    }

    if (left.id == null) {
      return 1;
    }

    if (right.id == null) {
      return -1;
    }

    return left.id - right.id;
  });

  const totals = new Map<
    string,
    {
      count: number;
      reactedByViewer: boolean;
    }
  >();

  for (const reaction of sortedReactions) {
    const existing = totals.get(reaction.emoji) ?? {
      count: 0,
      reactedByViewer: false,
    };

    const reactedByViewer =
      existing.reactedByViewer || isReactionFromViewer(reaction, identity);

    totals.set(reaction.emoji, {
      count: existing.count + 1,
      reactedByViewer,
    });
  }

  return Array.from(totals.entries()).map(
    ([emoji, { count, reactedByViewer }]) => ({
      count,
      emoji,
      reactedByViewer,
    }),
  );
};

export type { FeatureRequestReaction, ReactionSummary };
