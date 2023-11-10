import { Outlet, useNavigate } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";
import Nav from "./Navbar";
import { useUserContext } from "../hooks/userContext";
import { links } from "../consts";
import { getSafeCurrentPath } from "../lib/utils";

export default function UserLayout() {
  const { user, userLoading } = useUserContext();
  const navigate = useNavigate();
  if (userLoading) {
    return <LoadingOverlay visible={true} overlayBlur={2} />;
  }
  if (!user) {
    navigate(links.login + `?fromPath=${getSafeCurrentPath()}`, {
      replace: true,
    });
    return <div>Not logged in</div>;
  }
  return (
    <>
      <Nav user={user} />
      {/* <Container> */}
      <Outlet />
      {/* </Container> */}
    </>
  );
}
