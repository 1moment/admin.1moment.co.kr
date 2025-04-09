import type { CouponMutationData } from "@/hooks/use-coupons.tsx";

import * as React from "react";
import { format } from "date-fns/format";

import { Subheading } from "@/components/ui/heading.tsx";
import { Strong, Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input, InputGroup } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";

export default function CouponForm({
  coupon,
  onSubmit,
}: {
  coupon?: Coupon;
  onSubmit: (data: CouponMutationData) => void;
}) {
  return (
    <React.Fragment>
      <form
        id="promotion-sections-form"
        className="divide-y divide-gray-900/10"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);

          onSubmit({
            code: formData.get("code") as string,
            discountAmount: Number(formData.get("discountAmount")),
            productId: Number(formData.get("productId")),
            note: formData.get("note") as string,
            isExpired: formData.get("isExpired") === "on",
            isDownloadable: formData.get("isDownloadable") === "on",
            expirationDate: formData.get("expirationDate") as string,
          });
        }}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
          <div className="px-4 sm:px-0">
            <Subheading>기본정보</Subheading>
            <Text>상품에 대한 기본 정보</Text>
          </div>

          <div className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
            <FieldGroup>
              <Field>
                <Label>코드</Label>
                <Input name="code" defaultValue={coupon?.code} />
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
                    defaultValue={coupon?.discountAmount}
                  />
                </InputGroup>
              </Field>

              <Field>
                <Label>노트</Label>
                <Textarea name="note" defaultValue={coupon?.note} />
              </Field>

              <Field>
                <Label>만료여부</Label>
                <div>
                  <Switch name="isExpired" defaultChecked={coupon?.isExpired} />
                </div>
              </Field>

              <Field>
                <Label>다운로드 가능여부</Label>
                <div>
                  <Switch
                    name="isDownloadble"
                    defaultChecked={coupon?.isDownloadable}
                  />
                </div>
              </Field>

              <Field>
                <Label>만료일</Label>
                <Input
                  type="datetime-local"
                  name="expirationDate"
                  defaultValue={format(
                    new Date(coupon?.expirationDate || new Date()),
                    "yyyy-MM-dd HH:mm:ss",
                  )}
                />
              </Field>
            </FieldGroup>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-1">
          <Button type="submit">저장</Button>
        </div>
      </form>
    </React.Fragment>
  );
}
