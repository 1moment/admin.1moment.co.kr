import * as React from "react";

import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select } from "@/components/ui/select.tsx";

import { useCategories } from "@/hooks/use-categories.tsx";
import useFileUploadMutation from "@/hooks/use-file-upload-mutation.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function ProductCategoryForm({
  handleSubmit,
  productCategory,
}: {
  productCategory?: ProductCategory;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const {
    data: { items: productCategories },
  } = useCategories();
  const { mutate: fileUpload } = useFileUploadMutation();

  const [imageUrl, setImageUrl] = React.useState<string | undefined>(
    productCategory?.imageUrl,
  );
  const [mobileImageUrl, setMobileImageUrl] = React.useState<
    string | undefined
  >(productCategory?.mobileImageUrl);
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>기본정보</Subheading>
          <Text>상품에 대한 기본 정보</Text>
        </div>

        <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <FieldGroup>
            <Field>
              <Label>
                카테고리명&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input name="title" defaultValue={productCategory?.title} />
            </Field>

            <Field>
              <Label>
                SLUG&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input name="slug" defaultValue={productCategory?.slug} />
            </Field>

            <Field>
              <Label>
                상태&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Select name="status" defaultValue={productCategory?.status}>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
              </Select>
            </Field>

            <Field>
              <Label>
                PC 이미지&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input type="hidden" name="imageUrl" value={imageUrl} />
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
              <Label className="shrink-0">
                모바일 이미지&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input
                type="hidden"
                name="mobileImageUrl"
                value={mobileImageUrl}
              />
              <img src={mobileImageUrl} alt="" />
              <Input
                className="mt-3"
                type="file"
                accept="image/*"
                onChange={({ target, currentTarget: { files } }) => {
                  if (files?.[0]) {
                    fileUpload(files[0], {
                      onSuccess(data) {
                        setMobileImageUrl(data.url);
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
              <Input name="seq" defaultValue={productCategory?.seq} />
            </Field>
          </FieldGroup>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>상위 카테고리</Subheading>
          <Text>상품에 대한 기본 정보</Text>
        </div>

        <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <FieldGroup>
            <Field>
              <Select name="parentId" defaultValue={productCategory?.parentId}>
                <option value="">없음</option>
                {productCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}({category.slug})
                  </option>
                ))}
              </Select>
            </Field>
          </FieldGroup>
        </div>
      </div>
      <div className="flex justify-end gap-1">
        <Button type="submit">저장</Button>
      </div>
    </form>
  );
}
