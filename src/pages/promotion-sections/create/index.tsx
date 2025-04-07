import * as React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router";

import { Heading } from "@/components/ui/heading.tsx";
import PromotionSectionsForm from "@/components/promotion-sections/form.tsx";
import { usePromotionSectionCreateMutation } from "@/hooks/use-promotion-sections.tsx";

function PromotionSectionCreate() {
  const navigate = useNavigate();
  const { mutate: create, isPending } = usePromotionSectionCreateMutation();

  const onSubmit = React.useCallback(
    (data) => {
      create(data, {
        onSuccess(data) {
          navigate(`/promotion-sections/${data.id}`);
          alert("프로모션 섹션을 생성하였습니다.");
        },
        onError(error) {
          alert(error.message);
        },
      });
    },
    [create],
  );

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>맞춤형 추천상품 섹션</Heading>
      </div>

      <PromotionSectionsForm isLoading={isPending} onSubmit={onSubmit} />
    </React.Fragment>
  );
}

export default function PromotionSectionCreatePage() {
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
          <PromotionSectionCreate />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
