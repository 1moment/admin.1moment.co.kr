import * as React from "react";
import { useParams } from "react-router";
import * as Sentry from "@sentry/react";

import { Heading, Subheading } from "@/components/ui/heading.tsx";

import Products from "@/components/product-categories/products";
import {
  useCategory,
  useCategoryUpdateMutation,
} from "@/hooks/use-categories.tsx";
import ProductCategoryForm from "@/components/product-categories/form.tsx";
import { Button } from "@/components/ui/button.tsx";

function ProductCategoryPage() {
  const params = useParams<{ "product-category-id": string }>();

  const productCategoryId = Number(params["product-category-id"]);
  const { data: productCategory, refetch } = useCategory(productCategoryId);

  const { mutate: updateCategory } =
    useCategoryUpdateMutation(productCategoryId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: Parameters<typeof updateCategory>[0] = {};
    const formData = new FormData(e.currentTarget);

    if (productCategory.title !== formData.get("title")) {
      data.title = formData.get("title") as string;
    }

    if (productCategory.slug !== formData.get("slug")) {
      data.slug = formData.get("slug") as string;
    }

    if (productCategory.status !== formData.get("status")) {
      data.status = formData.get("status") as "PUBLISHED" | "DRAFT";
    }

    if (productCategory.imageUrl !== formData.get("imageUrl")) {
      data.imageUrl = formData.get("imageUrl") as string;
    }

    if (productCategory.mobileImageUrl !== formData.get("mobileImageUrl")) {
      data.mobileImageUrl = formData.get("mobileImageUrl") as string;
    }

    const parentId = formData.get("parentId")
      ? Number(formData.get("parentId"))
      : null;
    if (productCategory.parentId !== parentId) {
      data.parentId = parentId;
    }

    if (productCategory.seq !== Number(formData.get("seq"))) {
      data.seq = Number(formData.get("seq"));
    }

    updateCategory(data, {
      onSuccess() {
        alert("정보를 수정하였습니다");
        refetch();
      },
      onError(error) {
        alert(error.message);
      },
    });
  };

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>상품 카테고리 상세</Heading>
      </div>

      <ProductCategoryForm
        handleSubmit={handleSubmit}
        productCategory={productCategory}
      />

      <div className="mt-8 p-4 border border-gray-100 rounded shadow">
        <Subheading>연결된 상품</Subheading>
        <Sentry.ErrorBoundary
          fallback={({ error, resetError }) => (
            <div className="flex flex-col items-center gap-3">
              <p>{error?.message}</p>
              <Button onClick={resetError}>다시시도</Button>
            </div>
          )}
        >
          <React.Suspense fallback={<div>상품 목록 가져오는 중...</div>}>
            <Products productCategoryId={params["product-category-id"]} />
          </React.Suspense>
        </Sentry.ErrorBoundary>
      </div>
    </React.Fragment>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
          fallback={({ error, componentStack }) => {
            console.error(error, componentStack);
            return <p>{(error as Error).message}</p>;
          }}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">
              카테고리 정보를 불러오는 중...
            </div>
          }
        >
          <ProductCategoryPage />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
