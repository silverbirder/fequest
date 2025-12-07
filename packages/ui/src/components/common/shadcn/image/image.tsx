import type { ComponentProps } from "react";

import NextImage from "next/image";

type Props = ComponentProps<typeof NextImage> & {
  /**
   * Disable Next.js image optimization by default so remote product logos work
   * without additional domain allowlists.
   */
  unoptimized?: boolean;
};

export const Image = ({ unoptimized = true, ...props }: Props) => (
  <NextImage data-slot="image" unoptimized={unoptimized} {...props} />
);

Image.displayName = "Image";
