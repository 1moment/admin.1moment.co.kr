import * as React from "react";
import { useParams } from "react-router";

import { Heading } from "@/components/ui/heading";

import {useSnsSection, useSnsSectionUpdateMutation} from "@/hooks/use-sns-sections";
import SnsSectionForm from "@/components/sns-sections/form.tsx";

function SnsSection() {
  const params = useParams<{ "sns-section-id": string }>();

  const snsSectionId = Number(params["sns-section-id"]);
  const { data: snsSection, refetch } = useSnsSection(snsSectionId);
  const { mutate: updateData } = useSnsSectionUpdateMutation(snsSectionId);

  const onSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data: Parameters<typeof updateData>[0] = {};
      const formData = new FormData(event.currentTarget);
      if (
        snsSection.displayedHandlerName !== formData.get("displayedHandlerName")
      ) {
        data.displayedHandlerName = formData.get("displayedHandlerName");
      }

      if (snsSection.imageUrl !== formData.get("imageUrl")) {
        data.imageUrl = formData.get("imageUrl");
      }

      console.log("왓?", formData.get("categoryId"));
      if (snsSection.product.id !== Number(formData.get("productId"))) {
        data.productId = Number(formData.get("productId"));
      }

      if (snsSection.sequence !== Number(formData.get("sequence"))) {
        data.sequence = Number(formData.get("sequence"));
      }

      updateData(data, {
        onSuccess(data) {
          console.log(data);
          refetch();
          alert("성공");
        },
        onError() {
          alert("오류");
        },
      });
    },
    [snsSection, updateData],
  );

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>맞춤형 추천상품 섹션</Heading>
      </div>
      <SnsSectionForm
          snsSection={snsSection}
          onSubmit={onSubmit}
      />
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
