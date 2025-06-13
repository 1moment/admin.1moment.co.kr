import type { CouponMutationData } from "@/hooks/use-coupons.tsx";

import * as React from "react";
import { format } from "date-fns/format";

import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input, InputGroup } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

export default function CouponFormModal({
  open,
  onClose,
  title,
  coupon,
  isPending,
  onSubmit,
}: {
  coupon?: Coupon;
  onSubmit: (data: CouponMutationData) => void;
}) {
  const formId = React.useId();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || "쿠폰"}</DialogTitle>
      <DialogBody>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            onSubmit({
              code: formData.get("code") as string,
              title: formData.get("title") as string,
              discountAmount: Number(formData.get("discountAmount")),
              productId: Number(formData.get("productId")),
              note: formData.get("note") as string,
              isExpired: formData.get("isExpired") === "on",
              isDownloadable: formData.get("isDownloadable") === "on",
              expirationDate: formData.get("expirationDate") as string,
            });
          }}
        >
          <FieldGroup>
            <Field>
              <Label>코드</Label>
              <Input name="code" defaultValue={coupon?.code} />
            </Field>

            <Field>
              <Label>쿠폰명</Label>
              <Input name="title" defaultValue={coupon?.title} />
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
                  "yyyy-MM-dd'T'HH:mm",
                )}
              />
            </Field>
          </FieldGroup>
        </form>
      </DialogBody>
      <DialogActions>
        <Button color="light" onClick={onClose}>닫기</Button>
        <Button type="submit" isLoading={isPending} form={formId}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
