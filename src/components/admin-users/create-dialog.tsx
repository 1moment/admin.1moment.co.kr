import * as React from "react";

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";

import { useAdminUserCreateMutation } from "@/hooks/use-admin-users.tsx";

export default function CreateDialog({ refetch, isOpen, setIsOpen }) {
  const { mutate, isPending } = useAdminUserCreateMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    mutate(
      {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
        // @ts-ignore
        role: formData.get("role") as string,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: (error) => {
          alert(error.message);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(isPending)}>
      <DialogTitle>관리자 추가</DialogTitle>
      <DialogDescription>
        새로운 관리자의 정보를 입력해 주세요.
      </DialogDescription>

      <form onSubmit={handleSubmit}>
        <DialogBody>
          <FieldGroup>
            <Field>
              <Label>
                아이디&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input
                type="text"
                name="username"
                placeholder="아이디"
                required
                defaultValue=""
              />
            </Field>
            <Field>
              <Label>
                비밀번호&nbsp;<span className="text-red-400">*</span>
              </Label>
              <Input
                type="password"
                name="password"
                placeholder="비밀번호"
                required
                defaultValue=""
              />
            </Field>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-4">
              <Field>
                <Label>
                  이름&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="이름"
                  required
                  defaultValue=""
                />
              </Field>
              <Field>
                <Label>
                  권한&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Select name="role" defaultValue="MANAGER">
                  <option value="ADMIN">관리자</option>
                  <option value="MANAGER">매니저</option>
                  <option value="FLORIST">플로리스트</option>
                </Select>
              </Field>
            </div>
          </FieldGroup>
        </DialogBody>

        <DialogActions>
          <Button
            disabled={isPending}
            type="button"
            plain
            onClick={() => setIsOpen(false)}
          >
            취소
          </Button>
          <Button disabled={isPending} type="submit">
            추가하기
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
