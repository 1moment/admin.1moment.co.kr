import * as React from "react";
import * as Sentry from "@sentry/react";
import { useParams } from "react-router";

import { Heading, Subheading } from "@/components/ui/heading.tsx";
import {
  useAdminUser,
  useAdminUserUpdateMutation,
} from "@/hooks/use-admin-users.tsx";
import { Text } from "@/components/ui/text.tsx";
import { FieldGroup, Field, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select } from "@/components/ui/select.tsx";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import AdminUserForm from "@/components/admin-users/form.tsx";
import { ArrowLeftIcon } from "lucide-react";

function AdminUser() {
  const params = useParams<{ "admin-user-id": string }>();

  const adminUserId = Number(params["admin-user-id"]);
  const { data: adminUser, refetch } = useAdminUser(adminUserId);
  const { mutate: updateAdminUser } = useAdminUserUpdateMutation(adminUserId);

  const onSubmit = React.useCallback(
    (data) => {
      updateAdminUser(data, {
        onSuccess() {
          alert("정보를 변경하였습니다");
          refetch();
        },
        onError(error) {
          alert(error.message);
        },
      });
    },
    [adminUser, updateAdminUser, refetch],
  );

  const [openPasswordModal, setOpenPasswordModal] = React.useState(false);
  const [password, setPassword] = React.useState<string>();
  const [openActiveModal, setOpenActiveModal] = React.useState(false);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Button plain onClick={() => navigate(-1)}>
            <ArrowLeftIcon width={20} height={20} />
          </Button>
          <Heading>{adminUser.name}</Heading>
        </div>
        <div className="flex gap-3">
          <Button color="indigo" onClick={() => setOpenPasswordModal(true)}>
            비밀번호 변경
          </Button>
        </div>
      </div>

      <AdminUserForm adminUser={adminUser} onSubmit={onSubmit} />
      <Dialog open={openPasswordModal} onClose={setOpenPasswordModal}>
        <DialogTitle>비밀번호 변경</DialogTitle>
        <DialogDescription>관리자의 비밀번호를 변경합니다</DialogDescription>
        <DialogBody>
          <Field>
            <Label>
              비밀번호&nbsp;<span className="text-red-400">*</span>
            </Label>
            <Input
              type="password"
              name="password"
              value={password}
              onChange={({ currentTarget: { value } }) => setPassword(value)}
            />
          </Field>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setOpenPasswordModal(false)}>
            닫기
          </Button>
          <Button
            onClick={() => {
              updateAdminUser(
                { password },
                {
                  onSuccess() {
                    alert("비밀번호를 변경하였습니다");
                    setOpenPasswordModal(false);
                  },
                  onError(error) {
                    alert(error.message);
                  },
                },
              );
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={({ error }) => <p>{errorData.error.message}</p>}
      >
        <React.Suspense
          fallback={
            <div className="p-8 text-center">사용자정보를 불러오는 중...</div>
          }
        >
          <AdminUser />
        </React.Suspense>
      </Sentry.ErrorBoundary>
    </React.Fragment>
  );
}
