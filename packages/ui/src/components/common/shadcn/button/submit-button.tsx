"use client";

import type { ReactNode } from "react";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "./button";

type SubmitButtonProps = Omit<
  ButtonProps,
  "pending" | "pendingLabel" | "type"
> & {
  pending?: boolean;
  pendingLabel?: ReactNode;
};

export const SubmitButton = ({
  children,
  formAction,
  pending,
  pendingLabel,
  ...props
}: SubmitButtonProps) => {
  const { pending: formPending } = useFormStatus();

  return (
    <Button
      formAction={formAction}
      pending={pending ?? formPending}
      pendingLabel={pendingLabel ?? children}
      type="submit"
      {...props}
    >
      {children}
    </Button>
  );
};
