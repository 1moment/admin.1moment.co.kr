import * as React from "react";

import { Heading } from "@/components/ui/heading";
import SnsSectionForm from "@/components/sns-sections/form.tsx";

import { useSnsSectionCreateMutation } from "@/hooks/use-sns-sections";
import { useNavigate } from "react-router";

function SnsSection() {
  const navigate = useNavigate();
  const { mutate: createMutate } = useSnsSectionCreateMutation();

  const onSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      createMutate(
        {
          displayedHandlerName: formData.get("displayedHandlerName") as string,
          imageUrl: formData.get("imageUrl") as string,
          productId: Number(formData.get("productId")),
          sequence: Number(formData.get("sequence")) || undefined,
        },
        {
          onSuccess(data) {
            alert("인스타그램 섹션을 추가하였습니다");
            navigate(`/sns-sections/${data.id}`);
          },
          onError(error) {
            alert(error.message);
          },
        },
      );
    },
    [createMutate],
  );

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>인스타그램 섹션 추가</Heading>
      </div>
      <SnsSectionForm onSubmit={onSubmit} />
    </React.Fragment>
  );
}

export default function SnsSectionPage() {
  return (
    <React.Fragment>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">사용자정보를 불러오는 중...</div>
        }
      >
        <SnsSection />
      </React.Suspense>
    </React.Fragment>
  );
}
