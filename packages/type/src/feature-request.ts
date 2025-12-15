export type FeatureRequestCore = {
  content: string;
  createdAt?: Date | null | string;
  id: number;
  status: FeatureRequestStatus;
  title?: null | string;
  updatedAt?: Date | null | string;
};

export type FeatureRequestReaction = {
  anonymousIdentifier: null | string;
  emoji: string;
  id?: number;
  userId: null | string;
};

export type FeatureRequestStatus = "closed" | "open";

export type FeatureRequestUser = {
  id?: null | string;
  image?: null | string;
  name?: null | string;
};

export type ReactionSummary = {
  count: number;
  emoji: string;
  reactedByViewer: boolean;
};
