import * as React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading.tsx";
import { Button } from "@/components/ui/button.tsx";
import PromotionCategoriesForm from "@/components/promotion-categories/form.tsx";

import { usePromotionCategoryCreateMutation } from "@/hooks/use-promotion-categories.tsx";

function PromotionCategory() {
  const navigate = useNavigate();
  const { mutate: create, isPending } = usePromotionCategoryCreateMutation();

  const onSubmit = React.useCallback(
    (data) => {
      create(data, {
        onSuccess(data) {
          alert("맞춤형 추천상품 섹션을 추가하였습니다");
          navigate(`/promotion-categories/${data.id}`);
        },
        onError(error) {
          alert(error.message);
        },
      });
    },
    [create, navigate],
  );

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>맞춤형 추천상품 섹션 추가</Heading>
      </div>
      <PromotionCategoriesForm isLoading={isPending} onSubmit={onSubmit} />
    </React.Fragment>
  );
}

export default function PromotionCategoryPage() {
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
            <div className="p-8 text-center">정보를 불러오는 중...</div>
          }
        >
          <PromotionCategory />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
