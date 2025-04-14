import * as React from "react";
import * as Sentry from "@sentry/react";

import { useParams, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import ProductAdditionalGroupForm from "@/components/product-additional-groups/form";

import {
  useProductAdditionalGroup,
  useProductAdditionalGroupUpdateMutation,
} from "@/hooks/use-product-addtional-groups.tsx";

function ProductAdditionalGroup() {
  const navigate = useNavigate();

  const params = useParams<{ "product-additional-group-id": string }>();

  const productAdditionalGroupId = Number(
    params["product-additional-group-id"],
  );
  const { data: productAdditionalGroup, refetch } = useProductAdditionalGroup(
    productAdditionalGroupId,
  );
  //
  const { mutate, isPending, error } =
    useProductAdditionalGroupUpdateMutation(productAdditionalGroupId);
  // const { mutate: deleteProduct, isPending: isDeleting } =
  //   useProductDeleteMutation(productId);

  console.log(productAdditionalGroup);
  return (
    <React.Fragment>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Button plain onClick={() => navigate(-1)}>
            <ArrowLeftIcon width={20} height={20} />
          </Button>
          <Heading>{productAdditionalGroup.title}</Heading>
        </div>
        <div className="flex items-center gap-3">
          {/*<Button*/}
          {/*  color="red"*/}
          {/*  isLoading={isDeleting}*/}
          {/*  onClick={() => {*/}
          {/*    if (confirm("상품을 삭제하시겠습니까?")) {*/}
          {/*      deleteProduct(null, {*/}
          {/*        onSuccess() {*/}
          {/*          alert("상품을 삭제하였습니다");*/}
          {/*          navigate("/products");*/}
          {/*        },*/}
          {/*        onError(error) {*/}
          {/*          alert(error.message);*/}
          {/*        },*/}
          {/*      });*/}
          {/*    }*/}
          {/*  }}*/}
          {/*>*/}
          {/*  삭제*/}
          {/*</Button>*/}
        </div>
      </div>

      <ProductAdditionalGroupForm
        productAdditionalGroup={productAdditionalGroup}
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

export default function ProductAdditionalGroupPage() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={({ error, componentStack }) => {
          console.error(error, componentStack);
          return <p>{(error as Error).message}</p>;
        }}
      >
        <React.Suspense
          fallback={<div className="p-8 text-center">불러오는 중...</div>}
        >
          <ProductAdditionalGroup />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
