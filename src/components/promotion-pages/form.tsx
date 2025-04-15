import type { PromotionPageMutationData } from "@/hooks/use-promotion-pages";

import * as React from "react";
import { Subheading } from "@/components/ui/heading.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

export default function PromotionPagesForm({
  isLoading,
  promotionPage,
  onSubmit,
}: {
  isLoading?: boolean;
  promotionPage?: PromotionPage;
  onSubmit: (data: PromotionPageMutationData) => void;
}) {
  return (
    <form
      id="product-content-block-form"
      className="divide-y divide-gray-900/10"
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        onSubmit({
          title: formData.get("title") as string,
          slug: formData.get("slug") as string,
          description: formData.get("description") as string,
          tags: [],
          html: formData.get("html") as string,
          status: formData.get("status") as string,
        });
      }}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>기본정보</Subheading>
        </div>

        <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <FieldGroup>
            <Field>
              <Label>
                타이틀&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input name="title" defaultValue={promotionPage?.title} />
            </Field>

            <Field>
              <Label>
                SLUG&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input name="slug" defaultValue={promotionPage?.slug} />
            </Field>

            <Field>
              <Label>
                내용&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Textarea name="html" rows={10} defaultValue={promotionPage?.html} />
            </Field>

            <Field>
              <Label>설명</Label>
              <Input
                name="description"
                defaultValue={promotionPage?.description}
              />
            </Field>

            <Field>
              <Label>상태</Label>
              <Select
                name="status"
                defaultValue={promotionPage?.status || "DRAFT"}
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
              </Select>
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
