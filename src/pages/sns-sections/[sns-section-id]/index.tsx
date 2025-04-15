import * as React from "react";
import { useNavigate, useParams } from "react-router";

import { Heading } from "@/components/ui/heading";

import {
  useSnsSection,
  useSnsSectionUpdateMutation,
} from "@/hooks/use-sns-sections";
import SnsSectionForm from "@/components/sns-sections/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeftIcon } from "lucide-react";

function SnsSection() {
  const navigate = useNavigate();
  const params = useParams<{ "sns-section-id": string }>();

  const snsSectionId = Number(params["sns-section-id"]);
  const { data: snsSection, refetch } = useSnsSection(snsSectionId);
  const { mutate: updateData } = useSnsSectionUpdateMutation(snsSectionId);

  const onSubmit = React.useCallback(
    (data) => {
      updateData(data, {
        onSuccess(result) {
          refetch();
          alert("인스타그램 섹션을 수정하였습니다");
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
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        {/*<Heading>{snsSection.title}</Heading>*/}
      </div>
      <SnsSectionForm snsSection={snsSection} onSubmit={onSubmit} />
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
