import type { ProductContentBlockMutationData } from "@/hooks/use-product-content-blocks.tsx";

import * as React from "react";
import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Editor } from "@/components/ui/editor.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Switch } from "@/components/ui/switch.tsx";

export default function ProductContentBlockForm({
  isLoading,
  formData,
  onSubmit,
}: {
  isLoading?: boolean;
  formData?: ProductContentBlock;
  onSubmit: (data: ProductContentBlockMutationData) => void;
}) {
  const [content, setContent] = React.useState<string | undefined>(
    formData?.content,
  );
  return (
    <form
      id="product-content-block-form"
      className="divide-y divide-gray-900/10"
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        onSubmit({
          title: formData.get("title") as string,
          content,
          isUsed: formData.get("isUsed") === "on",
        });
      }}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>기본정보</Subheading>
          <Text>상품에 대한 기본 정보</Text>
        </div>

        <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <FieldGroup>
            <Field>
              <Label>
                타이틀&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input name="title" defaultValue={formData?.title} />
            </Field>

            <Field>
              <Label>
                사용여부&nbsp;<span className="text-red-400">*</span>
              </Label>
              <div className="mt-1">
                <Switch name="isUsed" defaultChecked={formData?.isUsed} />
              </div>
            </Field>
          </FieldGroup>
        </div>
      </div>

      <div className="py-10">
        <div className="p-4 sm:p-8 bg-white sm:rounded-xl">
          <FieldGroup>
            <Field>
              <Label>내용</Label>
              <Editor
                content={formData?.content}
                onUpdate={({ editor }) => setContent(editor.getHTML())}
              />
            </Field>
          </FieldGroup>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Button type="submit" isLoading={isLoading}>
          저장
        </Button>
      </div>
    </form>
  );
}
