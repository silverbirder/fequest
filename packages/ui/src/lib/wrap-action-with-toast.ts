import { toast } from "sonner";

export type ToastMessages = {
  error: string;
  loading: string;
  success: string;
};

const isNextRedirectError = (err: unknown): err is { digest: string } => {
  if (typeof err !== "object" || err === null) {
    return false;
  }

  const digest = (err as { digest?: unknown }).digest;
  if (typeof digest !== "string") {
    return false;
  }

  return digest.startsWith("NEXT_REDIRECT") || digest === "NEXT_RESPONSE";
};

export const wrapActionWithToast = <Args extends unknown[], Result>(
  action: (...args: Args) => Result,
  messages: ToastMessages,
) => {
  const { error, loading, success } = messages;

  return (async (...args: Args) => {
    const toastId = toast.loading(loading);
    try {
      const result = await action(...args);
      toast.success(success, { id: toastId });
      return result;
    } catch (err) {
      if (isNextRedirectError(err)) {
        toast.success(success, { id: toastId });
      } else {
        toast.error(error, { id: toastId });
      }

      throw err;
    }
  }) as (...args: Args) => Promise<Awaited<Result>>;
};
