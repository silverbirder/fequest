import { ImageResponse } from "next/og";

export const iconSizes = [48, 72, 96, 144, 192, 512];

export function generateImageMetadata() {
  return iconSizes.map((size) => ({
    contentType: "image/png",
    id: size,
    size: { height: size, width: size },
  }));
}

export const contentType = "image/png";

export default async function Icon({ id }: { id: Promise<number> }) {
  const size = await id;
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          fontSize: size,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        🗳️
      </div>
    ),
    {
      height: size,
      width: size,
    },
  );
}
