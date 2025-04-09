import * as React from "react";
import * as Sentry from "@sentry/react";
import { format } from "date-fns/format";

import { useNavigate, useParams } from "react-router";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import { InputGroup, Input } from "@/components/ui/input.tsx";
import { FieldGroup, Field, Label } from "@/components/ui/fieldset";
import { Text } from "@/components/ui/text";

import Users from "@/components/coupons/users";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeftIcon } from "lucide-react";
import { useCoupon } from "@/hooks/use-coupons.tsx";
import CouponForm from "@/components/coupons/form.tsx";

function Coupon() {
  const navigate = useNavigate();
  const params = useParams<{ "coupon-id": string }>();
  const [isEdit, setIsEdit] = React.useState(false);

  const couponId = Number(params["coupon-id"]);
  const { data: coupon } = useCoupon(couponId);

  return (
    <React.Fragment>
      <div className="flex items-center">
        <Button plain onClick={() => navigate(-1)}>
          <ArrowLeftIcon width={20} height={20} />
        </Button>
        <Heading>{coupon.id}</Heading>
      </div>
      <CouponForm
        coupon={coupon}
        onSubmit={(data) => {
          console.log("dfd", data);
        }}
      />
      <React.Suspense fallback={<div>상품 목록 가져오는 중...</div>}>
        <Users couponId={params["coupon-id"]} />
      </React.Suspense>
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
