import { toast } from "sonner";

export type ToastMessages = {
  error: string;
  loading: string;
  success: string;
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
      toast.error(error, { id: toastId });
      throw err;
    }
  }) as (...args: Args) => Promise<Awaited<Result>>;
};
