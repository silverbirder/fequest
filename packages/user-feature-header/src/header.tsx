import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const Header = ({ children }: Props) => {
  return <div>{children}</div>;
};
