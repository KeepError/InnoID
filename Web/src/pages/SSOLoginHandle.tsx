import { useSearchParams } from "react-router-dom";
import { useAPIRequest } from "../hooks/apiRequest";
import { loginWithSSO } from "../lib/api/modules/login";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUserContext } from "../hooks/userContext";
import { links } from "../consts";

type Context = {
  fromPath: string;
};

export default function LoginHandler(): JSX.Element {
  const { refreshUser } = useUserContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  if (!(searchParams.has("code") && searchParams.has("state"))) {
    return <div>Waiting...</div>;
  }
  const code = searchParams.get("code") || "";
  const state = searchParams.get("state") || "";

  const redirectUri = window.location.origin + links.loginHandleSSO;

  const { data, loading, call } = useAPIRequest(loginWithSSO);
  useEffect(() => {
    call(redirectUri, code, state);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data) {
    refreshUser();

    const navigateTo = data.loginContext.hasOwnProperty("fromPath")
      ? (data.loginContext as Context).fromPath
      : links.accountProfile;
    navigate(navigateTo, { replace: true });
  }

  return <div>Error...</div>;
}
