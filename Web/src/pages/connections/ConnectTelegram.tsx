import { createUserIdCode } from "../../lib/api/modules/profile";
import { getTelegramConnectURL } from "../../lib/telegram";
import { useAPIRequest } from "../../hooks/apiRequest";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ConnectTelegram(): JSX.Element {
  const { data, loading, call } = useAPIRequest(createUserIdCode);
  const [searchParams] = useSearchParams();

  const context = Object();
  if (searchParams.has("app")) context.appId = searchParams.get("app")!;
  if (searchParams.has("redirect"))
    context.redirect = searchParams.get("redirect")!;

  useEffect(() => {
    call(context);
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (data) {
    window.location.href = getTelegramConnectURL(data.id_code);
    return <div>Redirecting...</div>;
  }
  return <div>Error...</div>;
}
