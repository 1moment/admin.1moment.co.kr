import * as React from "react";
import { useNavigate } from "react-router";
import { signOut } from "aws-amplify/auth";

export default function LogoutPage() {
  const navigate = useNavigate();
  React.useEffect(() => {
    signOut().then(() => {
      navigate("/login", { replace: true });
    });
  }, [navigate]);
  return null;
}
