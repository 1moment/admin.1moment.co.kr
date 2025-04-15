import * as React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import ProductAdditionalGroupForm from "@/components/product-additional-groups/form";

import { useProductAdditionalGroupCreateMutation } from "@/hooks/use-product-addtional-groups";

function ProductCreate() {
  const navigate = useNavigate();

  const { mutate, isPending, error } =
    useProductAdditionalGroupCreateMutation();

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
      <ProductAdditionalGroupForm
        isLoading={isPending}
        fieldErrors={error?.fieldErrors}
        handleSubmit={(data) => {
          mutate(data, {
            onSuccess(data) {
              alert("상품을 추가하였습니다");
              navigate(`/product-additional-groups/${data.id}`, { replace: true });
            },
            onError(error) {
              if (
                error.fieldErrors &&
                Object.keys(error.fieldErrors).length > 0
              ) {
                const firstErrorField = Object.keys(error?.fieldErrors)[0];

                // Find the input element with the name attribute matching the error field
                const errorElement = document.querySelector(
                  `[name="${firstErrorField}"]`,
                );

                if (errorElement) {
                  // Scroll to the element with a small offset for better visibility
                  return errorElement.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }
              }
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
