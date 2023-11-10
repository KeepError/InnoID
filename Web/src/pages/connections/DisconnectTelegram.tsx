import { deleteUserTelegramConnection } from "../../lib/api/modules/profile";
import { useAPIRequest } from "../../hooks/apiRequest";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { links } from "../../consts";

export default function DisconnectTelegram(): JSX.Element {
  const { loading, call } = useAPIRequest(deleteUserTelegramConnection);
  useEffect(() => {
    call();
  }, []);
  if (loading) {
    return <div>Please wait...</div>;
  }
  return (
    <>
      <div>Successfully disconnected</div>
      <Link to={links.accountProfile}>Return to profile</Link>
    </>
  );
}
