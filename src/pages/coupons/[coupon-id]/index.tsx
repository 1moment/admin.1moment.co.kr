import * as React from "react";
import { apiClient } from "@/utils/api-client.ts";

import { useParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import { InputGroup, Input } from "@/components/ui/input.tsx";
import { FieldGroup, Field, Label } from "@/components/ui/fieldset";
import { Text } from "@/components/ui/text";

import Users from "@/components/coupons/users";
import { format } from "date-fns/format";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";

function Coupon() {
  const params = useParams<{ "coupon-id": string }>();
  const [isEdit, setIsEdit] = React.useState(false);

  const { data: coupon } = useSuspenseQuery<Coupon>({
    queryKey: ["coupons", params["coupon-id"]],
    queryFn: () =>
      apiClient(`/admin/coupons/${params["coupon-id"]}`).then((res) =>
        res.json(),
      ),
  });

  console.log(coupon);

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <Heading>상품 카테고리 상세</Heading>
      </div>
      <form
        id="coupon-form"
        className="mt-8 p-4 border border-gray-100 rounded shadow"
      >
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>기본정보</Subheading>
            <Text>현재 카테고리의 기본 정보</Text>
          </div>
          <div>
            <FieldGroup>
              <Field>
                <Label>쿠폰ID</Label>
                <Input value={coupon.id} disabled />
              </Field>

              <Field>
                <Label>코드</Label>
                <Input
                  name="code"
                  defaultValue={coupon.code}
                  readOnly={!isEdit}
                />
              </Field>

              <Field>
                <Label>할인액</Label>
                <InputGroup>
                  <p data-slot="icon" className="">
                    ₩
                  </p>
                  <Input
                    name="discountAmount"
                    type="number"
                    defaultValue={coupon.discountAmount}
                    readOnly={!isEdit}
                  />
                </InputGroup>
              </Field>

              <Field>
                <Label>노트</Label>
                <Textarea
                  name="note"
                  defaultValue={coupon.note}
                  readOnly={!isEdit}
                />
              </Field>

              <Field>
                <Label>만료여부</Label>
                <div>
                  <Switch
                    name="isExpired"
                    defaultChecked={coupon.isExpired}
                    disabled={!isEdit}
                  />
                </div>
              </Field>

              <Field>
                <Label>다운로드 가능여부</Label>
                <div>
                  <Switch
                    name="isDownloadble"
                    defaultChecked={coupon.isDownloadable}
                    disabled={!isEdit}
                  />
                </div>
              </Field>

              <Field>
                <Label>만료일</Label>
                <Input
                  type="datetime-local"
                  name="expirationDate"
                  defaultValue={format(
                    new Date(coupon.expirationDate),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
                  readOnly={!isEdit}
                />
              </Field>

              <Field>
                <Label>생성일</Label>
                <Text>
                  {format(new Date(coupon.createdAt), "yyyy-MM-dd hh:mm:ss")}
                </Text>
              </Field>
            </FieldGroup>
          </div>
        </section>
        {/*<section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">*/}
        {/*  <div className="space-y-1">*/}
        {/*    <Subheading>부모</Subheading>*/}
        {/*    <Text>PUBLISHED: 11<br/>DRAFT: 22</Text>*/}
        {/*  </div>*/}
        {/*  <div>*/}
        {/*    <Select name="status" defaultValue={productCategory.status}>*/}
        {/*      <option value="PUBLISHED">PUBLISHED</option>*/}
        {/*      <option value="DRAFT">DRAFT</option>*/}
        {/*    </Select>*/}
        {/*  </div>*/}
        {/*</section>*/}
      </form>
      <React.Suspense fallback={<div>상품 목록 가져오는 중...</div>}>
        <Users couponId={params["coupon-id"]} />
      </React.Suspense>
    </React.Fragment>
  );
}

export default function CouponPage() {
  return (
    <React.Fragment>
      <React.Suspense
        fallback={
          <div className="p-8 text-center">사용자정보를 불러오는 중...</div>
        }
      >
        <Coupon />
      </React.Suspense>
    </React.Fragment>
  );
}
