import { ImageResponse } from "next/og";

export const size = {
  height: 32,
  width: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          height: "100%",
          width: "100%",
        }}
      >
        🗳️
      </div>
    ),
    {
      ...size,
    },
  );
}
