import * as React from "react";
import { useNavigate } from "react-router";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AuthLayout } from "@/components/ui/auth-layout.tsx";
import { Heading } from "@/components/ui/heading.tsx";
import { signIn, getCurrentUser } from 'aws-amplify/auth';


export default function Index() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    setError(null);
    setIsLoading(true);

    try {
      await signIn({ username, password });
      navigate("/"); // 로그인 성공 후 대시보드로 이동
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다",
      );
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    getCurrentUser().then((data) => {
      navigate('/', { replace: true });
    })
  }, []);

  return (
    <AuthLayout className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        className="grid w-full max-w-sm grid-cols-1 gap-8"
        onSubmit={handleSubmit}
      >
        <Heading>관리자 로그인</Heading>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <FieldGroup>
          <Field>
            <Label>아이디</Label>
            <Input
              name="username"
              required
              defaultValue=""
              placeholder="아이디"
            />
          </Field>
          <Field>
            <Label>비밀번호</Label>
            <Input
              type="password"
              name="password"
              required
              defaultValue=""
              placeholder="아이디"
            />
          </Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            로그인
          </Button>
        </FieldGroup>
      </form>
    </AuthLayout>
  );
}
