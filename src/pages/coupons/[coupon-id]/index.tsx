import { format } from "date-fns/format";

import * as React from "react";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router";

import { ArrowLeftIcon } from "lucide-react";
import { Heading, Subheading } from "@/components/ui/heading.tsx";
import Users from "@/components/coupons/users";
import { Button } from "@/components/ui/button";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/ui/description-list";
import CouponFormModal from "@/components/coupons/form-modal.tsx";

import { useCoupon, useCouponUpdateMutation } from "@/hooks/use-coupons";

function Coupon() {
  const params = useParams<{ "coupon-id": string }>();
  const [isEdit, setIsEdit] = React.useState(null);

  const couponId = Number(params["coupon-id"]);
  const { data: coupon, refetch } = useCoupon(couponId);
  const { isPending: isUpdating, mutate: update } = useCouponUpdateMutation();

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>{coupon.id}</Heading>
      </div>
      <div className="mt-10 grid grid-cols-5 items-start gap-x-3">
        <Users couponId={params["coupon-id"]} />
        <div className="col-span-2 p-4 bg-white rounded-xl shadow">
          <div className="flex justify-between items-start">
            <Heading>기본정보</Heading>
            <Button onClick={() => setIsEdit(coupon)}>수정</Button>
          </div>

          <DescriptionList className="mt-4">
            <DescriptionTerm>코드</DescriptionTerm>
            <DescriptionDetails>{coupon.code}</DescriptionDetails>

            <DescriptionTerm>쿠폰명</DescriptionTerm>
            <DescriptionDetails>{coupon.title}</DescriptionDetails>

            <DescriptionTerm>노트</DescriptionTerm>
            <DescriptionDetails className="whitespace-pre-wrap">
              {coupon.note}
            </DescriptionDetails>

            <DescriptionTerm>할인금액</DescriptionTerm>
            <DescriptionDetails>
              {Number(coupon.discountAmount).toLocaleString("ko-KR")}원
            </DescriptionDetails>

            <DescriptionTerm>만료여부</DescriptionTerm>
            <DescriptionDetails>
              {coupon.isExpired ? "만료" : "사용가능"}
            </DescriptionDetails>

            <DescriptionTerm>만료일</DescriptionTerm>
            <DescriptionDetails>
              {format(new Date(coupon.expirationDate), "yyyy-MM-dd HH:mm:ss")}
            </DescriptionDetails>

            <DescriptionTerm>다운로드 가능여부</DescriptionTerm>
            <DescriptionDetails>
              {coupon.isDownloadable ? "가능" : "숨김"}
            </DescriptionDetails>
          </DescriptionList>
        </div>
      </div>

      <CouponFormModal
        open={!!isEdit}
        onClose={() => setIsEdit(null)}
        title="쿠폰 정보 수정"
        coupon={isEdit}
        isPending={isUpdating}
        onSubmit={(data) => {
          update(
            { couponId, ...data },
            {
              onSuccess() {
                refetch();
                setIsEdit(null);
                alert("수정이 완료되었습니다.");
              },
              onError(error) {
                alert(error.message);
              },
            },
          );
        }}
      />
    </React.Fragment>
  );
}

export default function CouponPage() {
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
            <div className="p-8 text-center">쿠폰 정보를 불러오는 중...</div>
          }
        >
          <Coupon />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
