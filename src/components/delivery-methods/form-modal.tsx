import type { CouponMutationData } from "@/hooks/use-coupons.tsx";

import * as React from "react";
import { format } from "date-fns/format";

import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input, InputGroup } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { XIcon } from "lucide-react";

export default function DeliveryMethodFormModal({
  open,
  onClose,
  title,
  deliveryMethod,
  isPending,
  onSubmit,
}) {
  const formId = React.useId();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogBody>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const data = {
              deliveryMethodId: formData.get("deliveryMethodId") as string,
              type: formData.get("type") as string,
              title: formData.get("title") as string,
              addedPrice: Number(formData.get("addedPrice")),
              discountedPrice: Number(formData.get("discountedPrice")),
              isDefault: formData.get("isDefault") === "on",
              availableDates: (
                formData.getAll("availableDates[]") as string[]
              ).map((date) => new Date(date)),
            };

            onSubmit(data);
          }}
        >
          <FieldGroup>
            <input
              type="hidden"
              name="deliveryMethodId"
              defaultValue={deliveryMethod?.id}
            />
            <Field>
              <Label>배송명</Label>
              <Input name="title" defaultValue={deliveryMethod?.title} />
            </Field>

            <Field>
              <Label>배송방식</Label>
              <Select name="type" defaultValue={deliveryMethod?.type}>
                <option value="QUICK">퀵</option>
                <option value="DELIVERY">택배</option>
                <option value="PICKUP">픽업</option>
              </Select>
            </Field>

            <div className="flex gap-3">
              <Field>
                <Label>추가금액</Label>
                <InputGroup>
                  <p data-slot="icon" className="">
                    ₩
                  </p>
                  <Input
                    name="addedPrice"
                    type="number"
                    defaultValue={deliveryMethod?.addedPrice}
                  />
                </InputGroup>
              </Field>
              <Field>
                <Label>할인액</Label>
                <InputGroup>
                  <p data-slot="icon" className="">
                    ₩
                  </p>
                  <Input
                    name="discountedPrice"
                    type="number"
                    defaultValue={deliveryMethod?.discountedPrice}
                  />
                </InputGroup>
              </Field>
            </div>

            <Field>
              <Label>기본 설정</Label>
              <Checkbox
                name="isDefault"
                defaultChecked={deliveryMethod?.isDefault}
              />
            </Field>

            <Field>
              <Label>가능한 날짜</Label>
              <Dates
                defaultValue={
                  deliveryMethod?.availableDates?.map((date) =>
                    format(new Date(date), "yyyy-MM-dd"),
                  ) || []
                }
              />
            </Field>
          </FieldGroup>
        </form>
      </DialogBody>
      <DialogActions>
        <Button color="light" onClick={onClose}>
          닫기
        </Button>
        <Button type="submit" isLoading={isPending} form={formId}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Dates({ defaultValue }) {
  const [dates, setDates] = React.useState<string[]>(new Set(defaultValue));

  const inputRef = React.useRef<HTMLInputElement>(null);
  return (
    <div>
      <ul className="flex flex-col gap-3">
        {Array.from(dates)
          .sort((a, b) => a.localeCompare(b))
          .map((date, idx) => (
            <li key={`date-${date}`}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => {
                    setDates((prev) => {
                      const newSet = new Set(prev);
                      newSet.delete(date);
                      return newSet;
                    });
                  }}
                >
                  <XIcon width={16} height={16} />
                </button>
                <p>{date}</p>
              </div>
              <input type="hidden" name="availableDates[]" value={date} />
            </li>
          ))}
      </ul>
      <div className="mt-5 flex gap-3">
        <Input
          ref={inputRef}
          type="date"
          defaultValue={format(new Date(), "yyyy-MM-dd")}
        />
        <Button
          className="shrink-0"
          onClick={() => {
            const input = inputRef.current;
            if (input) {
              const date = new Date(input.value);
              setDates((prev) => {
                const newSet = new Set(prev);
                newSet.add(format(date, "yyyy-MM-dd"));
                return newSet;
              });
            }
          }}
        >
          추가
        </Button>
      </div>
    </div>
  );
}
