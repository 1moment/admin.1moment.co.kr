import * as React from "react";
import { Outlet, useNavigate } from "react-router";
import { apiClient } from "./utils/api-client.ts";
import { useQuery } from "@tanstack/react-query";
import UserContext from "./contexts/user-context.ts";
import Layout from "./layout.tsx";

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { isLoading, isError, data } = useQuery<{
    id: number;
    username: string;
    name: number;
  }>({
    queryKey: ["me", token],
    queryFn: verifyToken,
    enabled: !!token, // token이 있을 때만 쿼리를 활성화합니다.
    retry: false, // 실패 시 재시도하지 않습니다.
  });

  React.useEffect(() => {
    if (!token || isError) {
      navigate("/login", { replace: true });
    }
  }, [token, isError, navigate]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (isError || !data) {
    return <Outlet />;
  }

  // token이 있고 유효하면 보호된 컴포넌트로 들어갑니다.
  return (
    <UserContext.Provider value={data}>
      <Layout>
        <Outlet />
      </Layout>
    </UserContext.Provider>
  );
}

async function verifyToken(): Promise<boolean> {
  const response = await apiClient("/admin/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Invalid token");
  }

  return await response.json();
}
