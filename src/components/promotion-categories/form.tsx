import type { PromotionCategoryMutationData } from "@/hooks/use-promotion-categories.tsx";

import * as React from "react";

import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select } from "@/components/ui/select.tsx";

import { useCategories } from "@/hooks/use-categories.tsx";
import useFileUploadMutation from "@/hooks/use-file-upload-mutation.tsx";

export default function PromotionCategoriesForm({
  isLoading,
  promotionCategory,
  onSubmit,
}: {
  isLoading?: boolean;
  promotionCategory?: PromotionCategory;
  onSubmit?: (data: PromotionCategoryMutationData) => void;
}) {
  const [imageUrl, setImageUrl] = React.useState<string>(
    promotionCategory?.imageUrl,
  );

  const { mutate: fileUpload } = useFileUploadMutation();
  const {
    data: { items: productCategories },
  } = useCategories({ limit: 100, status: "PUBLISHED" });

  return (
    <form
      id="promotion-categories-form"
      className="divide-y divide-gray-900/10"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        onSubmit({
          title: formData.get("title") as string,
          imageUrl,
          seq: Number(formData.get("seq")),
          categoryId: Number(formData.get("categoryId")),
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
              <Input name="title" defaultValue={promotionCategory?.title} />
            </Field>

            <Field>
              <Label>
                이미지&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input type="hidden" name="imageUrl" defaultValue={imageUrl} />
              <img src={imageUrl} alt="" />
              <Input
                className="mt-3"
                type="file"
                accept="image/*"
                onChange={({ target, currentTarget: { files } }) => {
                  if (files?.[0]) {
                    fileUpload(files[0], {
                      onSuccess(data) {
                        setImageUrl(data.url);
                      },
                      onSettled() {
                        target.value = "";
                      },
                    });
                  }
                }}
              />
            </Field>

            <Field>
              <Label>순서</Label>
              <Input name="seq" defaultValue={promotionCategory?.seq} />
            </Field>
          </FieldGroup>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>연결된 카테고리</Subheading>
          <Text>ㅇ</Text>
        </div>

        <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <Field>
            <Select
              name="categoryId"
              defaultValue={promotionCategory?.category?.id}
            >
              {productCategories.map((productCategory) => (
                <option key={productCategory.id} value={productCategory.id}>
                  {productCategory.title}
                </option>
              ))}
            </Select>
          </Field>
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
