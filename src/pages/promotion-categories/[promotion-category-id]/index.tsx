import * as React from "react";
import * as Sentry from "@sentry/react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading.tsx";
import { Button } from "@/components/ui/button.tsx";
import PromotionCategoriesForm from "@/components/promotion-categories/form.tsx";

import {
  usePromotionCategory,
  usePromotionCategoryUpdateMutation,
} from "@/hooks/use-promotion-categories.tsx";

function PromotionCategory() {
  const navigate = useNavigate();
  const params = useParams<{ "promotion-category-id": string }>();

  const promotionCategoryId = params["promotion-category-id"];
  const { data: promotionCategory, refetch } =
    usePromotionCategory(promotionCategoryId);
  const { mutate: updateData, isPending } =
    usePromotionCategoryUpdateMutation(promotionCategoryId);

  const onSubmit = React.useCallback(
    (data) => {
      updateData(data, {
        onSuccess(data) {
          refetch();
          alert("맞춤형 추천상품 섹션을 수정하였습니다");
        },
        onError(error) {
          alert(error.message);
        },
      });
    },
    [promotionCategory, updateData],
  );

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>{promotionCategory.title}</Heading>
      </div>
      <PromotionCategoriesForm
        isLoading={isPending}
        promotionCategory={promotionCategory}
        onSubmit={onSubmit}
      />
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
