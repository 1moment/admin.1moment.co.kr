import * as React from "react";
import * as Sentry from "@sentry/react";

import { useParams, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading.tsx";
import { Button } from "@/components/ui/button.tsx";
import ProductForm from "@/components/products/form.tsx";

import {
  useProduct,
  useProductDeleteMutation,
  useProductUpdateMutation,
} from "@/hooks/use-products.tsx";

function Product() {
  const navigate = useNavigate();

  const params = useParams<{ "product-id": string }>();

  const productId = Number(params["product-id"]);
  const { data: product, refetch } = useProduct(productId);

  const { mutate, isPending, error } = useProductUpdateMutation(productId);
  const { mutate: deleteProduct, isPending: isDeleting } =
    useProductDeleteMutation(productId);

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Button plain onClick={() => navigate(-1)}>
            <ArrowLeftIcon width={20} height={20} />
          </Button>
          <Heading>{product.title}</Heading>
        </div>
        <div className="flex items-center gap-3">
          <Button
            color="red"
            isLoading={isDeleting}
            onClick={() => {
              if (confirm("상품을 삭제하시겠습니까?")) {
                deleteProduct(null, {
                  onSuccess() {
                    alert("상품을 삭제하였습니다");
                    navigate("/products");
                  },
                  onError(error) {
                    alert(error.message);
                  },
                });
              }
            }}
          >
            삭제
          </Button>
        </div>
      </div>

      <ProductForm
        product={product}
        isLoading={isPending}
        fieldErrors={error?.fieldErrors}
        handleSubmit={(data) => {
          mutate(data, {
            onSuccess: () => {
              refetch();
              alert("수정을 완료하였습니다");
            },
            onError: (error) => {
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

export default function ProductPage() {
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
          <Product />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
