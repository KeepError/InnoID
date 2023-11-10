import { useEffect } from "react";
import { useAPIRequest } from "../hooks/apiRequest";
import { logout } from "../lib/api/modules/login";

export default function Logout(): JSX.Element {
  const { error, loading, call } = useAPIRequest(logout);
  useEffect(() => {
    call();
  }, []);

  if (loading) {
    return <div>Logging out...</div>;
  }

  if (error) {
    return <div>Error...</div>;
  }

  return <div>Logged out</div>;
}
