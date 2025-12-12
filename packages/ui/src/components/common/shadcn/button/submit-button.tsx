"use client";

import type { ReactNode } from "react";

import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { Button, type ButtonProps } from "./button";

type SubmitButtonProps = Omit<
  ButtonProps,
  "pending" | "pendingLabel" | "type"
> & {
  autoPending?: boolean;
  pending?: boolean;
  pendingLabel?: ReactNode;
  toastMessages?: {
    error?: string;
    loading?: string;
    success?: string;
  };
};

export const SubmitButton = ({
  autoPending = true,
  children,
  formAction,
  pending,
  pendingLabel,
  toastMessages,
  ...props
}: SubmitButtonProps) => {
  const { pending: formPending } = useFormStatus();
  const isPending = pending ?? (autoPending ? formPending : false);
  const wrappedFormAction =
    toastMessages && typeof formAction === "function"
      ? async (formData: FormData) => {
          const toastId = toast.loading(toastMessages.loading ?? "処理中...");
          try {
            await formAction(formData);
            toast.success(toastMessages.success ?? "完了しました", {
              id: toastId,
            });
          } catch (error) {
            toast.error(toastMessages.error ?? "エラーが発生しました", {
              id: toastId,
            });
            throw error;
          }
        }
      : formAction;

  return (
    <Button
      formAction={wrappedFormAction}
      pending={isPending}
      pendingLabel={pendingLabel ?? children}
      type="submit"
      {...props}
    >
      {children}
    </Button>
  );
};
