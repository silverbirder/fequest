import type { MetadataRoute } from "next";

import { iconSizes } from "./icon";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#fff",
    description: "機能リクエスト・共有プラットフォーム",
    display: "standalone",
    icons: iconSizes.map((size) => ({
      sizes: `${size}x${size}`,
      src: `/icon/${size}`,
      type: "image/png",
    })),
    name: "Fequest",
    short_name: "Fequest",
    start_url: "/",
    theme_color: "#fff",
  };
}
