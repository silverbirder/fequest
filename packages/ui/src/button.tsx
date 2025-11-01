"use client";

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  appName: string;
};

export const Button = ({ children, className, appName }: Props) => {
  return (
    <button
      className={className}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
