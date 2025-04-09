import * as React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading.tsx";
import ProductContentBlockForm from "@/components/product-content-blocks/form.tsx";
import { Button } from "@/components/ui/button.tsx";

import { useProductContentBlockCreateMutation } from "@/hooks/use-product-content-blocks.tsx";

function ProductContentBlock() {
  const navigate = useNavigate();

  const { mutate, isPending } = useProductContentBlockCreateMutation();

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>상세페이지 템플릿 생성</Heading>
      </div>
      <ProductContentBlockForm
        isLoading={isPending}
        onSubmit={(data) => {
          mutate(data, {
            onSuccess(data) {
              navigate(`/product-content-blocks/${data.id}`);
              alert("템플릿을 추가하였습니다");
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
