import type { MetadataRoute } from "next";

import { iconSizes } from "./icon";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#fff",
    description: "機能リクエスト・共有プラットフォームの管理",
    display: "standalone",
    icons: iconSizes.map((size) => ({
      sizes: `${size}x${size}`,
      src: `/icon/${size}`,
      type: "image/png",
    })),
    name: "Fequest Admin",
    short_name: "Fequest Admin",
    start_url: "/",
    theme_color: "#fff",
  };
}
