import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  component: Dialog,
  title: "Common/Shadcn/Dialog",
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const DialogExample = ({
  description = "Use dialogs to focus attention on a specific task.",
  showCloseButton = true,
  title = "Dialog Title",
  withExtraContent = false,
}: {
  description?: string;
  showCloseButton?: boolean;
  title?: string;
  withExtraContent?: boolean;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {withExtraContent && (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>This variation includes additional supporting text.</p>
            <p>
              You can place forms, lists, or any custom UI inside the dialog
              body.
            </p>
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const Default: Story = {
  render: () => <DialogExample />,
};

export const WithoutCloseButton: Story = {
  render: () => (
    <DialogExample
      description="The default close icon is hidden and a footer button handles dismissal."
      showCloseButton={false}
    />
  ),
};

export const WithExtraContent: Story = {
  render: () => (
    <DialogExample
      description="This dialog showcases how to structure more detailed content inside the body."
      title="Dialog With Details"
      withExtraContent
    />
  ),
};
