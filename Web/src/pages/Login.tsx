import { useEffect } from "react";
import { useAPIRequest } from "../hooks/apiRequest";
import { getSSOLoginURL } from "../lib/api/modules/login";
import { useSearchParams } from "react-router-dom";
import { links } from "../consts";

type Context = {
  fromPath?: string;
};

export default function Login(): JSX.Element {
  const [searchParams] = useSearchParams();
  const { data, loading, call } = useAPIRequest(getSSOLoginURL);

  const fromPath = searchParams.get("fromPath");

  const context: Context = {};
  if (fromPath) {
    context.fromPath = fromPath;
  }

  const redirectUri = window.location.origin + links.loginHandleSSO;
  useEffect(() => {
    call(redirectUri, context);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (data) {
    window.location.href = data.loginURL;
    return <div>Redirecting...</div>;
  }

  return <div>Error...</div>;
}
