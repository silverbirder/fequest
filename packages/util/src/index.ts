type IsoValue = Date | null | string | undefined;

const jaDateTimeFormatter = new Intl.DateTimeFormat("ja-JP", {
  day: "2-digit",
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  month: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Tokyo",
  year: "numeric",
});

const formatPart = (
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
) => parts.find((part) => part.type === type)?.value ?? "";

export const toIsoString = (value?: IsoValue): null | string => {
  if (!value) {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const parts = jaDateTimeFormatter.formatToParts(date);

  const year = formatPart(parts, "year");
  const month = formatPart(parts, "month");
  const day = formatPart(parts, "day");
  return `${year}年${month}月${day}日`;
};

export const formatCount = (value: number, locale = "ja-JP") =>
  new Intl.NumberFormat(locale).format(value);

export const buildUserProductUrl = (
  baseUrl: string | undefined,
  productId: number,
) => {
  if (!baseUrl) {
    return `/${productId}`;
  }

  try {
    const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return new URL(String(productId), normalizedBase).toString();
  } catch {
    return `/${productId}`;
  }
};
