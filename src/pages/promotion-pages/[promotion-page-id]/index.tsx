import * as React from "react";
import * as Sentry from "@sentry/react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading.tsx";
import { Button } from "@/components/ui/button.tsx";
import PromotionPagesForm from "@/components/promotion-pages/form.tsx";

import {
  usePromotionPage,
  usePromotionPageUpdateMutation,
} from "@/hooks/use-promotion-pages.tsx";

function PromotionPage() {
  const navigate = useNavigate();
  const params = useParams<{ "promotion-page-id": string }>();

  const promotionPageId = Number(params["promotion-page-id"]);
  const { data: promotionPage, refetch } = usePromotionPage(promotionPageId);
  const { mutate: updateData, isPending } =
    usePromotionPageUpdateMutation(promotionPageId);

  const onSubmit = React.useCallback(
    (data) => {
      updateData(data, {
        onSuccess(data) {
          refetch();
          alert("프로모션 페이지를 수정하였습니다");
        },
        onError(error) {
          alert(error.message);
        },
      });
    },
    [updateData, refetch],
  );

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>{promotionPage.title}</Heading>
      </div>
      <PromotionPagesForm
        isLoading={isPending}
        promotionPage={promotionPage}
        onSubmit={onSubmit}
      />
    </React.Fragment>
  );
}

export default function PromotionPagePage() {
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
          <PromotionPage />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
