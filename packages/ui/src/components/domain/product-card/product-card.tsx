import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const ProductCard = ({ children }: Props) => {
  return <div>{children}</div>;
};
