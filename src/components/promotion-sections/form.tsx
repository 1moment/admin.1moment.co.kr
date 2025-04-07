import * as React from "react";

import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Select } from "@/components/ui/select.tsx";

export default function PromotionSectionsForm({
  isLoading,
  promotionSection,
  onSubmit,
}) {
  return (
    <form
      id="promotion-sections-form"
      className="divide-y divide-gray-900/10"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        onSubmit({
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          sequence: Number(formData.get("sequence")),
          status: formData.get("status") as string,
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
              <Input name="title" defaultValue={promotionSection?.title} />
            </Field>

            <Field>
              <Label>설명</Label>
              <Textarea
                name="description"
                defaultValue={promotionSection?.description}
              />
            </Field>

            <Field>
              <Label>순서</Label>
              <Input
                name="sequence"
                defaultValue={promotionSection?.sequence}
              />
            </Field>

            <Field>
              <Label>상태</Label>
              <Select name="status" defaultValue={promotionSection?.status}>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
              </Select>
            </Field>
          </FieldGroup>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-1">
        <Button type="submit" isLoading={isLoading}>
          저장
        </Button>
      </div>
    </form>
  );
}
