import type { PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const RequestCard = ({ children }: Props) => {
  return <div>{children}</div>;
};
