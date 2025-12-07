type IsoValue = Date | null | string | undefined;

export const toIsoString = (value?: IsoValue): null | string => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

export const formatCount = (value: number, locale = "ja-JP") =>
  new Intl.NumberFormat(locale).format(value);
