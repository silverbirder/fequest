export type FeatureRequestCore = {
  content: string;
  createdAt?: Date | null | string;
  id: number;
  status: FeatureRequestStatus;
  title?: null | string;
  updatedAt?: Date | null | string;
};

export type FeatureRequestStatus = "closed" | "open";

export type FeatureRequestUser = {
  id?: null | string;
  image?: null | string;
  name?: null | string;
};
