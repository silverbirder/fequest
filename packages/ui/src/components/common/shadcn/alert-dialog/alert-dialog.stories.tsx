import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "../button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";

const meta = {
  component: AlertDialog,
  title: "Common/Shadcn/AlertDialog",
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const AlertDialogExample = ({
  actionLabel = "Continue",
  cancelLabel = "Cancel",
  description = "This action cannot be undone. This will permanently delete your data.",
  destructive = false,
  title = "Are you absolutely sure?",
  withDetails = false,
}: {
  actionLabel?: string;
  cancelLabel?: string;
  description?: string;
  destructive?: boolean;
  title?: string;
  withDetails?: boolean;
}) => {
  return (
    <AlertDialog defaultOpen>
      <AlertDialogTrigger asChild>
        <Button variant={destructive ? "destructive" : "default"}>
          Open Alert Dialog
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {withDetails && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Double-check that you have backups of any critical information
              before proceeding with this irreversible operation.
            </p>
            <p>
              Consider notifying other stakeholders so they are aware of the
              change.
            </p>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            className={
              destructive
                ? "bg-destructive text-white shadow-xs hover:bg-destructive/90"
                : undefined
            }
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const Default: Story = {
  render: () => <AlertDialogExample />,
};
