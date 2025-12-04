"use client";

import { Box, Button, HStack, Textarea, VStack } from "@repo/ui/components";
import { Pencil, Save, X } from "lucide-react";
import Form from "next/form";
import { useState } from "react";

type Props = {
  content: string;
  featureId: number;
  isOwner: boolean;
  onUpdateFeatureRequest?: (formData: FormData) => Promise<void>;
};

export const FeatureRequestContent = (props: Props) => {
  const [editing, setEditing] = useState(false);
  const onUpdateFeatureRequest = props.onUpdateFeatureRequest;
  const showEditor = props.isOwner && Boolean(onUpdateFeatureRequest);

  const handleUpdateFeatureRequest = async (formData: FormData) => {
    if (!onUpdateFeatureRequest) {
      return;
    }

    try {
      await onUpdateFeatureRequest(formData);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update feature request", error);
    }
  };

  return (
    <Box w="full">
      <Form action={handleUpdateFeatureRequest}>
        <input name="featureId" type="hidden" value={String(props.featureId)} />
        <VStack gap="sm">
          <Box bg="muted" p="xs" radius="sm" w="full">
            <Textarea
              defaultValue={editing ? props.content : undefined}
              placeholder="機能リクエストの内容を記載してください"
              readOnly={!editing}
              value={editing ? undefined : props.content}
              variant={editing ? "default" : "display"}
            />
          </Box>
          <HStack gap="sm">
            {showEditor && !editing && (
              <Button
                aria-label="編集する"
                onClick={() => setEditing(true)}
                size="sm"
                variant="ghost"
              >
                <Pencil />
                編集
              </Button>
            )}
            {editing && (
              <>
                <Button aria-label="保存する" size="sm" type="submit">
                  <Save />
                  保存
                </Button>
                <Button
                  aria-label="取り消す"
                  onClick={() => setEditing(false)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <X />
                  取り消す
                </Button>
              </>
            )}
          </HStack>
        </VStack>
      </Form>
    </Box>
  );
};
