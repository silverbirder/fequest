type SearchParams = Record<string, string | string[] | undefined> | undefined;

export const getOpenFeatureRequestId = (searchParams: SearchParams) => {
  const raw = searchParams?.open;
  const value = Array.isArray(raw)
    ? Number(raw[0])
    : typeof raw === "string"
      ? Number(raw)
      : null;

  if (value === null || !Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
};
