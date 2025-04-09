import * as React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading.tsx";
import { Button } from "@/components/ui/button.tsx";
import ProductForm from "@/components/products/form.tsx";

import { useProductCreateMutation } from "@/hooks/use-products.tsx";

function ProductCreate() {
  const navigate = useNavigate();

  const { mutate, isPending } = useProductCreateMutation();

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <Button plain onClick={() => navigate(-1)}>
            <ArrowLeftIcon width={20} height={20} />
          </Button>
          <Heading>상품 추가</Heading>
        </div>
      </div>
      <ProductForm
        isLoading={isPending}
        handleSubmit={(data) => {
          mutate(data, {
            onSuccess(data) {
              alert("상품을 추가하였습니다");
              navigate(`/products/${data.id}`);
            },
            onError(error) {
              alert(error.message);
            },
          });
        }}
      />
    </React.Fragment>
  );
}

export default function ProductCreatePage() {
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
            <div className="p-8 text-center">상품 정보를 불러오는 중...</div>
          }
        >
          <ProductCreate />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
