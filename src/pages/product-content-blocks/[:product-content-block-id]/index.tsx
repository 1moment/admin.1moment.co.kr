import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";

import { useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Heading } from "@/components/ui/heading.tsx";
import ProductContentBlockForm from "@/components/product-content-blocks/form.tsx";

function ProductContentBlock() {
  const params = useParams<{ "coupon-id": string }>();
  const [isEdit, setIsEdit] = React.useState(false);

  const productContentBlockId = Number(params["product-content-block-id"]);
  const { data: productContentBlock } = useSuspenseQuery<Coupon>({
    queryKey: ["product-content-blocks", productContentBlockId],
    queryFn: () =>
      apiClient(`/admin/product-content-blocks/${productContentBlockId}`).then(
        (res) => res.json(),
      ),
  });

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>상세페이지 템플릿 #{productContentBlock.id}</Heading>
      </div>
      <ProductContentBlockForm formData={productContentBlock} />
    </React.Fragment>
  );
}

export default function ProductContentBlockPage() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
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
