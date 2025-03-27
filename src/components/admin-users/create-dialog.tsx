import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/utils/api-client.ts";
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

export default function CreateDialog({ isOpen, setIsOpen }) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    any,
    any,
    {
      username: string;
      name: string;
      password: string;
      role: string;
    }
  >({
    mutationFn: (newUser) =>
      apiClient("/admin/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      }),
    onSuccess: () => {
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }); // 리스트 갱신
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    mutate({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
      role: formData.get("role") as string,
    });
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
              <Label>아이디</Label>
              <Input
                type="text"
                name="username"
                placeholder="아이디"
                required
                defaultValue=""
              />
            </Field>
            <Field>
              <Label>비밀번호</Label>
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
                <Label>이름</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="이름"
                  required
                  defaultValue=""
                />
              </Field>
              <Field>
                <Label>권한</Label>
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
