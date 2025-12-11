import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentProps } from "react";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { Button } from "../button";
import { Toaster } from "./sonner";

const meta = {
  args: {
    closeButton: true,
    containerAriaLabel: "Storybook sonner notifications",
    id: "story-toaster",
    position: "top-right",
    richColors: false,
  },
  component: Toaster,
  title: "Common/Shadcn/Sonner",
} satisfies Meta<typeof Toaster>;

export default meta;
type PlaygroundProps = ComponentProps<typeof Toaster>;

type Story = StoryObj<typeof meta>;

type ToastPlaygroundProps = PlaygroundProps & {
  initialToast?: (props: PlaygroundProps) => void;
};

const ToastPlayground = ({ initialToast, ...props }: ToastPlaygroundProps) => {
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (hasShownRef.current) return;
    hasShownRef.current = true;

    const id = initialToast?.(props);

    return () => {
      if (typeof id === "string" || typeof id === "number") {
        toast.dismiss(id);
      }
    };
  }, [initialToast, props]);

  return (
    <div
      style={{
        alignItems: "flex-start",
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <Button
        onClick={() =>
          toast.success("Saved", {
            description: "Your changes have been stored.",
            toasterId: props.id,
          })
        }
        variant="default"
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast.info("Heads up", {
            description: "Background sync is running.",
            toasterId: props.id,
          })
        }
        variant="secondary"
      >
        Info
      </Button>
      <Button
        onClick={() =>
          toast.warning("Check input", {
            description: "A few fields still need attention.",
            toasterId: props.id,
          })
        }
        variant="outline"
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          toast.error("Failed", {
            description: "We could not save your request.",
            toasterId: props.id,
          })
        }
        variant="destructive"
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
            error: "Retry",
            loading: "Processing",
            success: "Done",
            toasterId: props.id,
          })
        }
        variant="default"
      >
        Loading
      </Button>
      <Toaster {...props} />
    </div>
  );
};

const showInfo = (props: PlaygroundProps) =>
  toast.info("Heads up", {
    description: "Toasts appear automatically in this story.",
    position: props.position,
    toasterId: props.id,
  });

const showSuccess = (props: PlaygroundProps) =>
  toast.success("Saved", {
    description: "Your changes have been stored.",
    position: props.position,
    toasterId: props.id,
  });

const showWarning = (props: PlaygroundProps) =>
  toast.warning("Check input", {
    description: "A few fields still need attention.",
    position: props.position,
    toasterId: props.id,
  });

const showError = (props: PlaygroundProps) =>
  toast.error("Failed", {
    description: "We could not save your request.",
    position: props.position,
    toasterId: props.id,
  });

const showLoading = (props: PlaygroundProps) =>
  toast.loading("Processing", {
    description: "Working on it…",
    position: props.position,
    toasterId: props.id,
  });

export const Info: Story = {
  render: (args) => <ToastPlayground {...args} initialToast={showInfo} />,
};

export const Success: Story = {
  args: {
    id: "story-toaster-success",
  },
  render: (args) => <ToastPlayground {...args} initialToast={showSuccess} />,
};

export const Warning: Story = {
  args: {
    id: "story-toaster-warning",
  },
  render: (args) => <ToastPlayground {...args} initialToast={showWarning} />,
};

export const Error: Story = {
  args: {
    id: "story-toaster-error",
  },
  render: (args) => <ToastPlayground {...args} initialToast={showError} />,
};

export const Loading: Story = {
  args: {
    id: "story-toaster-loading",
  },
  render: (args) => <ToastPlayground {...args} initialToast={showLoading} />,
};

export const BottomLeft: Story = {
  args: {
    closeButton: false,
    id: "story-toaster-bottom-left",
    position: "bottom-left",
  },
  render: (args) => <ToastPlayground {...args} initialToast={showInfo} />,
};
