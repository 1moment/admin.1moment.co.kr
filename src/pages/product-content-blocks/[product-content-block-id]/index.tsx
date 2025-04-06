import * as React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading.tsx";
import ProductContentBlockForm from "@/components/product-content-blocks/form.tsx";
import { Button } from "@/components/ui/button.tsx";

import {
  useProductContentBlock,
  useProductContentBlockUpdateMutation,
} from "@/hooks/use-product-content-blocks.tsx";

function ProductContentBlock() {
  const navigate = useNavigate();
  const params = useParams<{ "product-content-block-id": string }>();

  const productContentBlockId = Number(params["product-content-block-id"]);
  const { data: productContentBlock, refetch } = useProductContentBlock(
    productContentBlockId,
  );

  const { mutate, isPending } = useProductContentBlockUpdateMutation(
    productContentBlockId,
  );

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>{productContentBlock.title}</Heading>
      </div>
      <ProductContentBlockForm
        isLoading={isPending}
        formData={productContentBlock}
        onSubmit={(data) => {
          mutate(data, {
            onSuccess() {
              refetch();
              alert("템플릿을 수정하였습니다");
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

export default function ProductContentBlockPage() {
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
            <div className="p-8 text-center">사용자정보를 불러오는 중...</div>
          }
        >
          <ProductContentBlock />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
