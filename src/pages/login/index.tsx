import * as React from "react";
import { useNavigate } from "react-router";
import { Field, FieldGroup, Label } from "@/components/ui/fieldset.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function Index() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.get("username"),
            password: formData.get("password"),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("로그인에 실패했습니다");
      }

      const data = await response.json();
      console.log("fewfe?", data);
      // 로그인 성공 처리
      localStorage.setItem("token", data.accessToken); // 토큰이 있는 경우
      navigate("/"); // 로그인 성공 후 대시보드로 이동
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          관리자 로그인
        </h2>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
}
