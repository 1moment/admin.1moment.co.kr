import * as React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Heading } from "@/components/ui/heading.tsx";
import { Button } from "@/components/ui/button.tsx";
import PromotionPagesForm from "@/components/promotion-pages/form.tsx";

import { usePromotionPageCreateMutation } from "@/hooks/use-promotion-pages.tsx";

function PromotionPageCreate() {
  const navigate = useNavigate();
  const { mutate: updateData, isPending } = usePromotionPageCreateMutation();

  const onSubmit = React.useCallback(
    (data) => {
      updateData(data, {
        onSuccess(data) {
          navigate(`/promotion-pages/${data.id}`, { replace: true });
          alert("프로모션 페이지를 추가하였습니다");
        },
        onError(error) {
          alert(error.message);
        },
      });
    },
    [updateData],
  );

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>프로모션 페이지 추가</Heading>
      </div>
      <PromotionPagesForm isLoading={isPending} onSubmit={onSubmit} />
    </React.Fragment>
  );
}

export default function PromotionPageCreatePage() {
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
          <PromotionPageCreate />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
