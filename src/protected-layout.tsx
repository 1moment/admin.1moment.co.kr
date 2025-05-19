import * as React from "react";
import { Outlet, useNavigate } from "react-router";
import UserContext from "./contexts/user-context.ts";

import Layout from "./layout.tsx";
import { fetchUserAttributes, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export default function ProtectedLayout() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    fetchUserAttributes()
      .then((userAttributes) => {
        return fetchAuthSession().then((session) => {
          setUser({
            id: userAttributes.sub,
            name: userAttributes.name,
            email: userAttributes.email,
            groups: session.tokens?.idToken?.payload['cognito:groups'],
          })
        })
      })
      .catch((error) => {
        navigate("/login", { replace: true });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Outlet />;
  }

  // token이 있고 유효하면 보호된 컴포넌트로 들어갑니다.
  return (
    <UserContext.Provider value={user}>
      <Layout>
        <Outlet />
      </Layout>
    </UserContext.Provider>
  );
}
