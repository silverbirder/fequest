import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const Products = ({ children }: Props) => {
  return <div>{children}</div>;
};
