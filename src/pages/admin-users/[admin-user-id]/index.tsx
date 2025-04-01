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

function AdminUser() {
  const params = useParams<{ "admin-user-id": string }>();

  const adminUserId = Number(params["admin-user-id"]);
  const { data: adminUser, refetch } = useAdminUser(adminUserId);
  const { mutate: updateAdminUser } = useAdminUserUpdateMutation(adminUserId);

  const onSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);

      const data: Parameters<typeof updateAdminUser>[0] = {};
      if (adminUser.username !== formData.get("username")) {
        data.username = formData.get("username") as string;
      }

      if (adminUser.name !== formData.get("name")) {
        data.name = formData.get("name") as string;
      }

      if (adminUser.role !== formData.get("role")) {
        // @ts-ignore
        data.role = formData.get("role") as string;
      }

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
        <Heading className="">{adminUser.name}</Heading>
        <div className="flex gap-3">
          <Button
            color={adminUser.isActive ? "green" : "red"}
            onClick={() => setOpenActiveModal(true)}
          >
            {adminUser.isActive ? "활성화" : "비활성화"}
          </Button>
          <Button color="indigo" onClick={() => setOpenPasswordModal(true)}>
            비밀번호 변경
          </Button>
        </div>
      </div>

      <form
        className="mt-10 p-4 border border-gray-100 rounded shadow"
        onSubmit={onSubmit}
      >
        <section className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Subheading>기본정보</Subheading>
            <Text>현재 섹션의 기본 정보</Text>
          </div>
          <div>
            <FieldGroup>
              <Field>
                <Label>
                  username&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Input name="username" defaultValue={adminUser.username} />
              </Field>

              <Field>
                <Label>
                  이름&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Input name="name" defaultValue={adminUser.name} />
              </Field>

              <Field>
                <Label>
                  권한&nbsp;<span className="text-red-400">*</span>
                </Label>
                <Select name="role" defaultValue={adminUser.role}>
                  <option value="ADMIN">관리자</option>
                  <option value="MANAGER">매니저</option>
                  <option value="FLORIST">플로리스트</option>
                </Select>
              </Field>

              <div className="flex justify-end">
                <Button type="submit">저장</Button>
              </div>
            </FieldGroup>
          </div>
        </section>
      </form>
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

      <Dialog open={openActiveModal} onClose={setOpenActiveModal}>
        <DialogTitle>관리자 활성화 상태 변경</DialogTitle>
        <DialogDescription>
          관리자의 활성화 상태를 변경합니다.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setOpenActiveModal(false)}>
            닫기
          </Button>
          {adminUser.isActive ? (
            <Button
              color="red"
              onClick={() => {
                updateAdminUser(
                  { isActive: false },
                  {
                    onSuccess() {
                      refetch();
                      alert("관리자를 비활성화하였습니다.");
                      setOpenActiveModal(false);
                    },
                  },
                );
              }}
            >
              비활성
            </Button>
          ) : (
            <Button
              color="green"
              onClick={() => {
                updateAdminUser(
                  { isActive: true },
                  {
                    onSuccess() {
                      refetch();
                      alert("관리자를 활성화하였습니다.");
                      setOpenActiveModal(false);
                    },
                  },
                );
              }}
            >
              활성화
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default function Page() {
  return (
    <React.Fragment>
      <Sentry.ErrorBoundary
        fallback={(errorData) => <p>{errorData.error.message}</p>}
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
