import * as React from "react";
import { useNavigate, useParams } from "react-router";
import * as Sentry from "@sentry/react";

import { Heading, Subheading } from "@/components/ui/heading.tsx";

import { Button } from "@/components/ui/button.tsx";
import { ArrowLeftIcon } from "lucide-react";
import { useBanner, useBannerUpdateMutation } from "@/hooks/use-banners.tsx";
import BannersForm from "@/components/banners/form.tsx";

function ProductCategoryPage() {
  const navigate = useNavigate();
  const params = useParams<{ "banner-id": string }>();

  const bannerId = Number(params["banner-id"]);
  const { data: banner, refetch } = useBanner(bannerId);
  const { mutate: updateBanner, isPending } = useBannerUpdateMutation(bannerId);

  const handleSubmit = (data) => {
    updateBanner(data, {
      onSuccess() {
        refetch();
        alert("수정을 완료하였습니다");
      },
      onError(error) {
        alert(error.message);
      },
    });
  };

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>{banner.title}</Heading>
      </div>

      <BannersForm
        isLoading={isPending}
        banner={banner}
        onSubmit={handleSubmit}
      />
    </React.Fragment>
  );
}

export default function Page() {
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
            <div className="p-8 text-center">
              카테고리 정보를 불러오는 중...
            </div>
          }
        >
          <ProductCategoryPage />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
