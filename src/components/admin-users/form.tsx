import type { AdminUserMutationData } from "@/hooks/use-admin-users.tsx";

import * as React from "react";

import { Subheading } from "@/components/ui/heading.tsx";
import { Text } from "@/components/ui/text.tsx";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Select } from "@/components/ui/select.tsx";
import { Button } from "@/components/ui/button.tsx";
import { SwitchField, Switch } from "@/components/ui/switch.tsx";

export default function AdminUserForm({
  adminUser,
  onSubmit,
}: { adminUser?: AdminUser; onSubmit: (data: AdminUserMutationData) => void }) {
  return (
    <form
      className="divide-y divide-gray-900/10"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        onSubmit({
          username: formData.get("username") as string,
          name: formData.get("name") as string,
          role: formData.get("role") as string,
          isActive: formData.get("isActive") === "on",
        });
      }}
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 py-10 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <Subheading>기본정보</Subheading>
          <Text />
        </div>

        <FieldGroup className="px-4 py-6 sm:p-8 bg-white ring-1 shadow-xs ring-gray-900/5 sm:rounded-xl md:col-span-2">
          <Field>
            <Label>USERNAME</Label>
            <Input name="username" defaultValue={adminUser?.username} />
          </Field>

          <Field>
            <Label>
              이름&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Input name="name" defaultValue={adminUser?.name} />
          </Field>

          <Field>
            <Label>
              권한&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Select name="role" defaultValue={adminUser?.role}>
              <option value="ADMIN">관리자</option>
              <option value="MANAGER">매니저</option>
              <option value="FLORIST">플로리스트</option>
            </Select>
          </Field>

          <Field>
            <Label>활성화 여부</Label>
            <div className="mt-1">
              <Switch name="isActive" defaultChecked={adminUser?.isActive} />
            </div>
          </Field>
        </FieldGroup>
      </div>

      <div className="mt-10 flex justify-end">
        <Button type="submit">저장</Button>
      </div>
    </form>
  );
}
