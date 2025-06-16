import type { CouponMutationData } from "@/hooks/use-coupons.tsx";

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from "@/components/ui/dialog.tsx";
import { FieldGroup, Field, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { usePayPoint } from "@/hooks/use-points.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function PointsFormModal({
  open,
  onClose,
  title,
  userId,
  onSuccess,
}) {
  const formId = React.useId();

  const { isPending, mutate } = usePayPoint();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogBody>
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            mutate(
              {
                userId: Number(formData.get("userId")),
                amount: Number(formData.get("amount")),
                note: formData.get("note") as string,
              },
              {
                onSuccess(result) {
                  if (typeof onSuccess === "function") onSuccess();
                  onClose();
                },
                onError(error) {
                  alert(error.message);
                },
              },
            );
          }}
        >
          <FieldGroup>
            {userId && <input type="hidden" name="userId" value={userId} />}
            <Field>
              <Label>금액</Label>
              <Input type="number" name="amount" />
            </Field>

            <Field>
              <Label>노트</Label>
              <Input name="note" />
            </Field>
          </FieldGroup>
        </form>
      </DialogBody>
      <DialogActions>
        <Button color="light" onClick={onClose}>
          취소
        </Button>
        <Button type="submit" form={formId} isLoading={isPending}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
}
