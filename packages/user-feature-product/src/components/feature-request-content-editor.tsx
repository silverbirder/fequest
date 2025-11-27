"use client";

import { Button } from "@repo/ui/components";
import Form from "next/form";
import { useState } from "react";

type Props = {
  content: string;
  featureId: number;
  onUpdateFeatureRequest?: (formData: FormData) => Promise<void>;
};

export const FeatureRequestContentEditor = (props: Props) => {
  const [editing, setEditing] = useState(false);

  if (!props.onUpdateFeatureRequest) return null;

  return !editing ? (
    <Button onClick={() => setEditing(true)} size="sm">
      編集
    </Button>
  ) : (
    <Form action={props.onUpdateFeatureRequest} className="w-full">
      <input name="featureId" type="hidden" value={props.featureId} />
      <textarea
        className="w-full min-h-[200px] rounded-md border p-2"
        defaultValue={props.content}
        name="content"
      />
      <div className="mt-2 flex gap-2">
        <Button type="submit">保存</Button>
        <Button onClick={() => setEditing(false)} type="button" variant="ghost">
          取消
        </Button>
      </div>
    </Form>
  );
};
