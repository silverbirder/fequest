"use client";

import type { ReactNode } from "react";

import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "./button";

type SubmitButtonProps = Omit<
  ButtonProps,
  "pending" | "pendingLabel" | "type"
> & {
  autoPending?: boolean;
  pending?: boolean;
  pendingLabel?: ReactNode;
};

export const SubmitButton = ({
  autoPending = true,
  children,
  pending,
  pendingLabel,
  ...props
}: SubmitButtonProps) => {
  const { pending: formPending } = useFormStatus();
  const isPending = pending ?? (autoPending ? formPending : false);

  return (
    <Button
      pending={isPending}
      pendingLabel={pendingLabel ?? children}
      type="submit"
      {...props}
    >
      {children}
    </Button>
  );
};
