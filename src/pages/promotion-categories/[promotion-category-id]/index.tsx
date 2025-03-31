import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import { format } from "date-fns/format";

import { useParams } from "react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FieldGroup, Field, Label } from "@/components/ui/fieldset";
import { Text } from "@/components/ui/text";
import useFileUploadMutation from "../../../hooks/use-file-upload-mutation.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select } from "@/components/ui/select.tsx";
import useCategories from "../../../hooks/use-categories.tsx";

function PromotionCategory() {
  const params = useParams<{ "promotion-category-id": string }>();

  const promotionCategoryId = params["promotion-category-id"];
  const { data: promotionCategory } = useSuspenseQuery<PromotionCategory>({
    queryKey: ["promotion-categories", promotionCategoryId],
    queryFn: () =>
      apiClient(`/admin/promotion-categories/${promotionCategoryId}`).then(
        (res) => res.json(),
      ),
  });

  const {
    data: { items: productCategories },
  } = useCategories({ limit: 100, status: 'PUBLISHED' });
  const { mutate: updateData } = useMutation<
    PromotionCategory,
    Error,
    Pick<
      Partial<PromotionCategory & { categoryId: number }>,
      "title" | "imageUrl" | "seq" | "categoryId"
    >
  >({
    async mutationFn(data) {
      const result = await apiClient(
        `/admin/promotion-categories/${promotionCategoryId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      return await result.json();
    },
  });
  const { mutate: fileUpload } = useFileUploadMutation();
  const onSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = {};
      const formData = new FormData(event.currentTarget);
      if (promotionCategory.title !== formData.get("title")) {
        data.title = formData.get("title");
      }

      if (promotionCategory.imageUrl !== formData.get("imageUrl")) {
        data.imageUrl = formData.get("imageUrl");
      }

      console.log('왓?', formData.get('categoryId'))
      if (promotionCategory.categoryId !== Number(formData.get("categoryId"))) {
        data.categoryId = Number(formData.get("categoryId"));
      }

      if (promotionCategory.seq !== Number(formData.get("seq"))) {
        data.seq = Number(formData.get("seq"));
      }

      updateData(data, {
        onSuccess(data) {
          console.log(data);
          alert("성공");
        },
        onError() {
          alert("오류");
        },
      });
    },
    [promotionCategory, updateData],
  );

  const [imageUrl, setImageUrl] = React.useState<string>(
    promotionCategory.imageUrl,
  );

  console.log(productCategories)
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>맞춤형 추천상품 섹션</Heading>
      </div>
      <form
        id="promotion-category-form"
        className="mt-8 p-4 border border-gray-100 rounded shadow"
        onSubmit={onSubmit}
      >
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>기본정보</Subheading>
            <Text>현재 섹션의 기본 정보</Text>
          </div>
          <div>
            <FieldGroup>
              <Field>
                <Label>
                  타이틀&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Input name="title" defaultValue={promotionCategory.title} />
              </Field>

              <Field>
                <Label>
                  연결된 카테고리&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Select name="categoryId" defaultValue={promotionCategory.category.id}>
                  {productCategories.map((productCategory) => (
                    <option key={productCategory.id} value={productCategory.id}>
                      {productCategory.title}
                    </option>
                  ))}
                </Select>
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
                <Input name="seq" defaultValue={promotionCategory.seq} />
              </Field>

              <Field>
                <Label>생성일</Label>
                <Text>
                  {format(
                    new Date(promotionCategory.createdAt),
                    "yyyy-MM-dd hh:mm:ss",
                  )}
                </Text>
              </Field>
            </FieldGroup>

            <div className="mt-6 flex justify-end gap-1">
              <Button type="submit">저장</Button>
            </div>
          </div>
        </section>
      </form>
    </React.Fragment>
  );
}

export default function PromotionCategoryPage() {
  return (
    <React.Fragment>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">사용자정보를 불러오는 중...</div>
        }
      >
        <PromotionCategory />
      </React.Suspense>
    </React.Fragment>
  );
}
