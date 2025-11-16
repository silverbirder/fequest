export type FeatureRequestReaction = {
  anonymousIdentifier: null | string;
  emoji: string;
  userId: null | string;
};

export type ReactionSummary = {
  count: number;
  emoji: string;
  reactedByViewer: boolean;
};

type ViewerIdentity = {
  viewerAnonymousIdentifier?: null | string;
  viewerUserId?: null | string;
};

const isReactionFromViewer = (
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

  const totals = new Map<
    string,
    {
      count: number;
      reactedByViewer: boolean;
    }
  >();

  for (const reaction of reactions) {
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

export { isReactionFromViewer };
