import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";

import { useParams } from "react-router";
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import { Divider } from "@/components/ui/divider.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FieldGroup, Field, Label } from "@/components/ui/fieldset";
import { Text } from "@/components/ui/text";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button.tsx";

import Products from "@/components/product-categories/products";

function ProductCategoryPage() {
  const params = useParams<{ "product-category-id": string }>();
  const [isEdit, setIsEdit] = React.useState(false);

  const queryClient = useQueryClient();
  const { data: productCategory } = useSuspenseQuery<ProductCategory>({
    queryKey: ["product-categories", params["product-category-id"]],
    queryFn: () =>
      apiClient(
        `/admin/product-categories/${params["product-category-id"]}`,
      ).then((res) => res.json()),
  });

  const { data: productCategories } = useSuspenseQuery<ProductCategory[]>({
    queryKey: ["product-categories"],
    queryFn: () =>
      apiClient(`/admin/product-categories`).then((res) => res.json()),
  });

  const { mutate } = useMutation<
    ProductCategory,
    any,
    Pick<Partial<ProductCategory>, "title" | "slug" | "status" | "parentId">
  >({
    mutationFn: async (data) => {
      const result = await apiClient(
        `/admin/product-categories/${params["product-category-id"]}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );
      return result.json();
    },
    onSuccess: () => {
      // 성공 이후 데이터 다시 불러옴 (캐시된 데이터 갱신)
      queryClient.invalidateQueries({
        queryKey: ["product-categories", params["product-category-id"]],
      });
    },
    onError: (error) => {
      console.error("업데이트 실패: ", error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const status = formData.get("status") as string;

    const patchData = {
      title,
      slug,
      status,
    };

    mutate(patchData);
  };

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>상품 카테고리 상세</Heading>
        <div className="flex gap-3">
          {isEdit ? (
            <React.Fragment>
              <Button
                key="submit-button"
                color="white"
                onClick={() => setIsEdit(false)}
              >
                취소
              </Button>
              <Button
                key="submit-button"
                color="green"
                type="submit"
                form="product-category-form"
              >
                저장
              </Button>
            </React.Fragment>
          ) : (
            <Button
              key="edit-button"
              color="white"
              onClick={() => setIsEdit(true)}
            >
              수정
            </Button>
          )}
        </div>
      </div>
      <Divider className="mt-3 mb-6" />
      <form id="product-category-form" onSubmit={handleSubmit}>
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>기본정보</Subheading>
            <Text>현재 카테고리의 기본 정보</Text>
          </div>
          <div>
            <FieldGroup>
              <Field>
                <Label>카테고리명</Label>
                <Input
                  name="title"
                  defaultValue={productCategory.title}
                  readOnly={!isEdit}
                />
              </Field>

              <Field>
                <Label>SLUG</Label>
                <Input
                  name="slug"
                  defaultValue={productCategory.slug}
                  readOnly={!isEdit}
                />
              </Field>

              <Field>
                <Label>상태</Label>
                <Select
                  name="status"
                  defaultValue={productCategory.status}
                  disabled={!isEdit}
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                </Select>
              </Field>

              <Field>
                <Label>PC 이미지</Label>
                <img src={productCategory.imageUrl} alt="" />
                <Input type="file" />
              </Field>

              <Field>
                <Label className="shrink-0">모바일 이미지</Label>
                <Input className="w-10" type="file" placeholder="" />

              </Field>
              <img src={productCategory.mobileImageUrl} alt="" />

              <Field>
                <Label>순서</Label>
                <Text>{productCategory.seq}</Text>
              </Field>
            </FieldGroup>
          </div>
        </section>

        <Divider className="my-10" />

        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>상위 카테고리</Subheading>
          </div>
          <Select defaultValue={productCategory.parentId} disabled={!isEdit}>
            <option value="">없음</option>
            {productCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}({category.slug})
              </option>
            ))}
          </Select>
        </section>

        <Divider className="my-10" />

        <React.Suspense fallback={<div>상품 목록 가져오는 중...</div>}>
          <Products productCategoryId={params["product-category-id"]} />
        </React.Suspense>
        {/*<section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">*/}
        {/*  <div className="space-y-1">*/}
        {/*    <Subheading>부모</Subheading>*/}
        {/*    <Text>PUBLISHED: 11<br/>DRAFT: 22</Text>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <Select name="status" defaultValue={productCategory.status}>*/}
        {/*      <option value="PUBLISHED">PUBLISHED</option>*/}
        {/*      <option value="DRAFT">DRAFT</option>*/}
        {/*    </Select>*/}
        {/*  </div>*/}
        {/*</section>*/}
      </form>
    </React.Fragment>
  );
}



export default function Page() {
  return (
    <React.Fragment>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">사용자정보를 불러오는 중...</div>
        }
      >
        <ProductCategoryPage />
      </React.Suspense>
    </React.Fragment>
  );
}
