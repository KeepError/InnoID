import { Box } from "@mantine/core";
import Shell from "./shell/Shell";
import { IconCode, IconFileText, IconUser } from "@tabler/icons-react";
import ShellNavLink from "./shell/ShellNavLink";
import { Outlet } from "react-router-dom";
import { links } from "../consts";

export default function UserShell() {
  return (
    <Shell
      navSection={
        <Box>
          <ShellNavLink
            icon={<IconUser />}
            label="Profile"
            to={links.accountProfile}
          />
          <ShellNavLink
            icon={<IconFileText />}
            label="Permissions"
            to={links.accountPermissions}
          />
          <ShellNavLink
            icon={<IconCode />}
            label="Develop"
            to={links.accountDevelop}
          />
        </Box>
      }
    >
      <Outlet />
    </Shell>
  );
}
